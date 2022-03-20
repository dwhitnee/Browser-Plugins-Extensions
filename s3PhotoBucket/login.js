/* global AWS, AmazonCognitoIdentity, s3 */
//----------------------------------------------------------------------
// Login with Cognito and get auth token for AWS calls
// 2022 David Whitney
//
// Adapted from https://github.com/amazon-archives/amazon-cognito-auth-js/blob/master/sample/index.html//
//----------------------------------------------------------------------

function setup() {
  let s3Params = { Bucket: "dwhitnee-videos", region: "us-west-1" };

  let identityPool = "us-east-1:2e17d11e-11d5-4810-8620-9acae707e140";
  let userPoolUrl = "cognito-idp.us-east-1.amazonaws.com/us-east-1_d8ZhbRImF";

  let cognitoAppConfig = {
    ClientId: "55htjchp4ehcfa4h4usfpmdjlf",
    UserPoolId: "us-east-1_d8ZhbRImF",
    AppWebDomain: "dwhitnee-photos.auth.us-east-1.amazoncognito.com",
    TokenScopesArray: ["openid","email"],
    IdentityProvider: "COGNITO"
  };
}


let homeURL = window.location.href;
// let homeURL = "https://dwhitnee-pictures.s3.amazonaws.com/cog.html";
// let homeURL = "http://localhost/~dwhitney/Browser-Plugins-Extensions/s3PhotoBucket/cog.html";

let cognitoAppConfig = {
  ClientId: "55htjchp4ehcfa4h4usfpmdjlf",
  UserPoolId: "us-east-1_d8ZhbRImF",
  AppWebDomain: "dwhitnee-photos.auth.us-east-1.amazoncognito.com",
  TokenScopesArray: ["openid","email"],  // like ['openid','email','phone']...
  IdentityProvider: "COGNITO", // COGNITO, Facebook, SignInWithApple, Google,LoginWithAmazon
  RedirectUriSignIn: homeURL,  // post login page
  RedirectUriSignOut: homeURL, // post logout page
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
}


/*
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
*/


// Initialize a cognito auth object.
// https://us-east-1.console.aws.amazon.com/cognito/users?region=us-east-1#/pool/us-east-1_d8ZhbRImF/clients

// login: https://dwhitnee-photos.auth.us-east-1.amazoncognito.com/login?client_id=55htjchp4ehcfa4h4usfpmdjlf&response_type=code&scope=email+openid+phone&redirect_uri=https://dwhitnee-pictures.s3.amazonaws.com/index.html

// https://dwhitnee-photos.auth.us-east-1.amazoncognito.com/login?client_id=55htjchp4ehcfa4h4usfpmdjlf&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost/~dwhitney/Browser-Plugins-Extensions/s3PhotoBucket/cog.html

// Select Implicit grant to have user pool JSON web tokens (JWT) returned to you from Amazon Cognito. You can use this flow when there's no backend available to exchange an authorization code for tokens.


function initAWS( region, UserPoolId ) {
}

//----------------------------------------------------------------------
//  Create Cognito object that handles authentication and
//----------------------------------------------------------------------
async function doCognitoAuth( params ) {
  console.log("Starting auth process");

  // requires old library
  var auth = new AmazonCognitoIdentity.CognitoAuth( params.cognitoAppConfig );

  let authPromise = new Promise((resolve, reject) =>  {
    auth.userhandler = {
      //----------
      // cognito logged us in, create AWS creds
      //----------
      onSuccess: function getAuthToken( result ) {
        console.log("Signed in!");
        let userPoolUrl = params.userPoolUrl;
        AWS.config.region = params.authRegion;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: params.identityPoolId,
          Logins: {
            [userPoolUrl]: result.idToken.jwtToken   // link user with identity
          }
        });

        resolve();
      },
      //----------
      onFailure: function goLogin( err ) {
        console.err( err );
        alert( err );
        reject( err );
      }
    };
  });

  auth.parseCognitoWebResponse( window.location.href );
  auth.getSession();

  // The default response_type is "token", next line will make it be "code".
  // auth.useCodeGrantFlow();

  // auth.signOut();

  let result = await authPromise;
}


function login() {
  console.log("Checking auth");

  let cognitoAppConfig = {
    ClientId: "55htjchp4ehcfa4h4usfpmdjlf",
    UserPoolId: "us-east-1_d8ZhbRImF",
    AppWebDomain: "dwhitnee-photos.auth.us-east-1.amazoncognito.com",
    TokenScopesArray: ["openid","email"],
    IdentityProvider: "COGNITO",
    RedirectUriSignIn:  window.location.href,
    RedirectUriSignOut: window.location.href
  };

  let authData = {
    cognitoAppConfig: cognitoAppConfig,
    authRegion: "us-east-1",
    userPoolUrl: "cognito-idp.us-east-1.amazonaws.com/us-east-1_d8ZhbRImF",
    IdentityPoolId: "us-east-1:2e17d11e-11d5-4810-8620-9acae707e140"
  };

  doCognitoAuth( authData ).then( function() {
    doStuff();
  });
}


function doStuff() {

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

      let hrefURL = s3.getSignedUrl('getObject', { Bucket: 'bucket', Key: 'key'});
    }
  });
}
