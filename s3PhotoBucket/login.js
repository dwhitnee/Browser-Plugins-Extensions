// from https://github.com/amazon-archives/amazon-cognito-auth-js/blob/master/sample/index.html
// 

let accessToken = undefined;  // global magic

function howdy( region, identityPool, poolURL ) {
  let auth = initCognitoSDK();
  auth.parseCognitoWebResponse( window.location.href );

  auth.getSession();

  AWS.config.region = region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPool,
    Logins: {
       [poolUrl]: result.idToken.jwtToken
    }
  });


  // document.getElementById("signInButton").addEventListener(
  //   "click", 
  //   function() {
  //     userButton(auth);
  //   });
}


 
function goLogin( err ) {
  alert("Error!" + err);
}

// Initialize a cognito auth object.
// https://us-east-1.console.aws.amazon.com/cognito/users?region=us-east-1#/pool/us-east-1_d8ZhbRImF/clients

// login: https://dwhitnee-photos.auth.us-east-1.amazoncognito.com/login?client_id=55htjchp4ehcfa4h4usfpmdjlf&response_type=code&scope=email+openid+phone&redirect_uri=https://dwhitnee-pictures.s3.amazonaws.com/index.html

// Select Implicit grant to have user pool JSON web tokens (JWT) returned to you from Amazon Cognito. You can use this flow when there's no backend available to exchange an authorization code for tokens. 

function initCognitoSDK() {

  let homeURL = "https://dwhitnee-pictures.s3.amazonaws.com/index.html";

  // https://us-east-1.console.aws.amazon.com/cognito/users/?region=us-east-1#/pool/us-east-1_d8ZhbRImF/app-integration-app-settings

  var authData = {
    ClientId: "55htjchp4ehcfa4h4usfpmdjlf",
    UserPoolId: "us-east-1_d8ZhbRImF",
    AppWebDomain: "dwhitnee-photos.auth.us-east-1.amazoncognito.com",
    TokenScopesArray: ["openid","email"],  // like ['openid','email','phone']...
    IdentityProvider: "COGNITO", // COGNITO, Facebook, SignInWithApple, Google,LoginWithAmazon
    RedirectUriSignIn: homeURL,  // the url on sign authin
    RedirectUriSignOut: homeURL, // the url on sign out
    AdvancedSecurityDataCollectionFlag : false
  };

  var auth = new AmazonCognitoIdentity.CognitoAuth( authData );

  auth.userhandler = {
    onFailure: goLogin( err ) { alert( err ); },
    onSuccess: getAuthToken( result ) {
      alert("Signed in!");

      /* Use the idToken for Logins Map when Federating User Pools with
       identity pools or when passing through an Authorization Header to an
       API Gateway Authorizer */
      var idToken = result.idToken.jwtToken;
      
      // Is this the magic?
      accessToken = result.getAccessToken().getJwtToken();
      
      // react
      cognitoId.verifySession({ props, auth });
    },

  };

  // The default response_type is "token", 
  // uncomment the next line will make it be "code".
  // auth.useCodeGrantFlow();

  return auth;
}

