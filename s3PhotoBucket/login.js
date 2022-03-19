/* global AWS, AmazonCognitoIdentity, s3 */
//----------------------------------------------------------------------
// Login with Cognito and get auth token for AWS calls
// 2022 David Whitney
//
// Adapted from https://github.com/amazon-archives/amazon-cognito-auth-js/blob/master/sample/index.html//
//----------------------------------------------------------------------



//let homeURL = "https://dwhitnee-pictures.s3.amazonaws.com/index.html";
let homeURL = "http://localhost/~dwhitney/Browser-Plugins-Extensions/s3PhotoBucket/cog.html";

let authData = {
  ClientId: "55htjchp4ehcfa4h4usfpmdjlf",
  UserPoolId: "us-east-1_d8ZhbRImF",
  AppWebDomain: "dwhitnee-photos.auth.us-east-1.amazoncognito.com",
  TokenScopesArray: ["openid","email"],  // like ['openid','email','phone']...
  IdentityProvider: "COGNITO", // COGNITO, Facebook, SignInWithApple, Google,LoginWithAmazon
  RedirectUriSignIn: homeURL,  // the url on sign authin
  RedirectUriSignOut: homeURL, // the url on sign out
  AdvancedSecurityDataCollectionFlag : false
};



//----------------------------------------------------------------------
function howdy( region, identityPool ) {
  /*
  let auth = initCognitoSDK();
  auth.parseCognitoWebResponse( window.location.href );
  auth.getSession();
  */

  let userPoolUrl = "cognito-idp.us-east-1.amazonaws.com/us-east-1_d8ZhbRImF";

  // requires an auth reponse
  AWS.config.region = region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPool,
    Logins: {
       [userPoolUrl]: result.idToken.jwtToken
    }
  });

  AWS.config.credentials.refresh( (error) => {
    if (error) {
      console.error( error );
    } else {
      // do stuff!  FIXME
      let s3 = new AWS.S3( {
        apiVersion: '2006-03-01',
        params: { Bucket: bucket }
      });
    }
  });


  // document.getElementById("signInButton").addEventListener(
  //   "click",
  //   function() {
  //     userButton(auth);
  //   });
}

// wtf?
function addCredsToAWSConfig( userPool ) {

  // how TF do I get this?
  var cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
    cognitoUser.getSession( function(err, result) {

      if (result) {
        console.log('You are now logged in.');

        // Add the User's Id Token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'YOUR_IDENTITY_POOL_ID',
          Logins: {
            'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result.getIdToken().getJwtToken()
          }
        });
      }
    });
}
}

function goLogin( err ) {
  alert("Error!" + err);
}

// Initialize a cognito auth object.
// https://us-east-1.console.aws.amazon.com/cognito/users?region=us-east-1#/pool/us-east-1_d8ZhbRImF/clients

// login: https://dwhitnee-photos.auth.us-east-1.amazoncognito.com/login?client_id=55htjchp4ehcfa4h4usfpmdjlf&response_type=code&scope=email+openid+phone&redirect_uri=https://dwhitnee-pictures.s3.amazonaws.com/index.html

// https://dwhitnee-photos.auth.us-east-1.amazoncognito.com/login?client_id=55htjchp4ehcfa4h4usfpmdjlf&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost/~dwhitney/Browser-Plugins-Extensions/s3PhotoBucket/cog.html

// Select Implicit grant to have user pool JSON web tokens (JWT) returned to you from Amazon Cognito. You can use this flow when there's no backend available to exchange an authorization code for tokens.



//----------------------------------------------------------------------
//----------------------------------------------------------------------
function getAuthFromCognito() {
  console.log("Creating auth object");

  // https://us-east-1.console.aws.amazon.com/cognito/users/?region=us-east-1#/pool/us-east-1_d8ZhbRImF/app-integration-app-settings

  // requires shitty library
  var auth = new AmazonCognitoIdentity.CognitoAuth( authData );
  auth.userhandler = {
    onFailure: function goLogin( err ) { alert( err ); },
    onSuccess: function getAuthToken( result ) {
      console.log("Signed in!");

      // HOW TF TO GET AN AWS CREDS OBJECT!!!

      /* Use the idToken for Logins Map when Federating User Pools with
       identity pools or when passing through an Authorization Header to an
       API Gateway Authorizer */
      var idToken = result.idToken.jwtToken;

      // Is this the magic?
      // accessToken = result.getAccessToken().getJwtToken();

      let userPoolUrl = "cognito-idp.us-east-1.amazonaws.com/us-east-1_d8ZhbRImF";

      AWS.config.region = "us-east-1";
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:2e17d11e-11d5-4810-8620-9acae707e140",
        Logins: {
          [userPoolUrl]: result.idToken.jwtToken
        }
      });

      // do stuff!
      AWS.config.credentials.refresh( (error) => {
        if (error) {
          console.error( error );
        } else {
          s3 = new AWS.S3( {
            apiVersion: '2006-03-01',
            params: { Bucket: "dwhitnee-videos", region: "us-west-1" }
          });
          s3Bucket = "dwhitnee-videos";
          displayPage();
        }
      });

    }
  };


  auth.parseCognitoWebResponse( window.location.href );

 //   auth.signOut();
  auth.getSession();

  // The default response_type is "token",
  // uncomment the next line will make it be "code".
  // auth.useCodeGrantFlow();

  return auth;
}


function login() {
  console.log("Checking auth");
  let auth = getAuthFromCognito();
}
