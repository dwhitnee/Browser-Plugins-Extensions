/* global AWS, AmazonCognitoIdentity */
//----------------------------------------------------------------------
// Login with AWS Cognito and get auth token for AWS calls
//
// Must create a UserPool and decide which login to use, then create an IdentityPool
// with approriate permissions for the UserPool to use.
//
// 2022 David Whitney
//
// Adapted from https://github.com/amazon-archives/amazon-cognito-auth-js/blob/master/sample/index.html//
//----------------------------------------------------------------------

// let cognitoAppConfig = {  // All from Cognito Console or Teraform
//   ClientId: "...",
//   UserPoolId: "...",
//   AppWebDomain: "dwhitnee-photos.auth.us-east-1.amazoncognito.com",
//   TokenScopesArray: ["openid","email"],  // like ['openid','email','phone']...
//   IdentityProvider: "COGNITO", // COGNITO, Facebook, SignInWithApple, Google,LoginWithAmazon
// };

// Select Implicit grant to have user pool JSON web tokens (JWT) returned to you from Amazon Cognito. You use this flow when there's no backend available to exchange an authorization code for tokens.


//----------------------------------------------------------------------
// Unique config for this user pool.  Should go in index.html
// This URL must be added to Userpool/Appclient/Hosted UI/Allowed callback URLs
//
// @return auth promise from cognito when login complete
//----------------------------------------------------------------------
async function login() {
  console.log("Checking auth");

  let cognitoAppConfig = {
    ClientId: "55htjchp4ehcfa4h4usfpmdjlf",
    UserPoolId: "us-east-1_d8ZhbRImF",  // "WhitneyPhotoViewers"
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
    identityPoolId: "us-east-1:2e17d11e-11d5-4810-8620-9acae707e140"
  };

  return doCognitoAuth( authData );  // promise
}


//----------------------------------------------------------------------
//  Create Cognito object that handles authentication and
//  @return promise for auth completion
//----------------------------------------------------------------------
function doCognitoAuth( params ) {
  console.log("Starting auth process");

  // requires old library
  var auth = new AmazonCognitoIdentity.CognitoAuth( params.cognitoAppConfig );

  let authPromise = new Promise((resolve, reject) =>  {
    auth.userhandler = {
      //----------------------------------------
      // cognito logged us in, create AWS creds
      //----------------------------------------
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

        // https://stackoverflow.com/questions/37179906/refresh-of-aws-config-credentials
        // maybe only necessary after an hour?
        AWS.config.credentials.refresh( (error) => {
          if (error) {
            console.error( error );
            auth.signOut();
            reject( error );
          } else {
            resolve();
          }
        });
      },
      //----------
      onFailure: function goLogin( err ) {
        console.err( err );
        auth.signOut();
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

  return authPromise;
}
