/* global AWS */
//----------------------------------------------------------------------
// Browse hierarchical photo albums in an S3 bucket
// 2022 David Whitney
//
// Usage:
//    init( s3Bucket, identityPool );
//    displayPage();
//----------------------------------------------------------------------

var s3;
var albumBucketName;  // passed into init()
var root = "";   // directory we are in

// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-browser-credentials-cognito.html

// Initialize the Amazon Cognito credentials provider (IdentityPool created elsewhere)
// AWS nuts and bolts
function init( bucket, identityPool ) {
  albumBucketName = bucket;

  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPool,
  });

  s3 = new AWS.S3( {
      apiVersion: '2006-03-01',
      params: { Bucket: bucket }
    });
}

// set up AWS config, auth handled elsewhere
function initS3( s3BucketParams ) {
  albumBucketName = s3BucketParams.Bucket;

  console.log("viewing files in " + albumBucketName);
  s3 = new AWS.S3( {
    apiVersion: '2006-03-01',
    params: s3BucketParams
  });
}


// change URL so browser history works
function changePage( root ) {
  document.location.search = "?root=" + root;
}

// utility function to create content from array of HTML.
function getHtml( template ) {
  return template.join('\n');
}

// encode single quotes, too
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

//----------------------------------------------------------------------
// Main function to build the page
//----------------------------------------------------------------------
function displayPage() {
  // Probably first page load, check if this is a bookmark
  if (root == "") {
    // FIXME: this breaks if ?root not present but ?somethingElse is

    let query = document.location.search;
    root = decodeURIComponent( query.replace(/\?root=/,''));
  }
  console.log("Displaying " + root);

  document.getElementById('breadcrumb').innerText = root;
  if (!root) {
    document.getElementById("backButton").style.display = "none";
  }

  s3.listObjects(
    { Prefix: root, Delimiter: '/' },
    function(err, data) {
      if (err) {
        return alert('There was an error accessing your albums: ' + err.message);
      } else {
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + albumBucketName + '/';

        displayAlbums( data.CommonPrefixes, "albums");      // directory names
        displayPhotos( data.Contents, bucketUrl, "photos"); // file contents of directory
      }
      return true;
    });
}


// @return  promise to get a temporary clickable URL for this S3 object
async function getTemporaryLink( bucket, key ) {

  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      'getObject', { Bucket: bucket, Key: key, Expires: 900},  // 15 minute token
      function( err, data ) {
        if (err) { reject( err ); }
        else { resolve( data ); }
      });
  });
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function displayAlbums( albumData, elementId ) {

  var albums = albumData.map(
    function( commonPrefix ) {
      var prefix = commonPrefix.Prefix;
      let dirName = decodeURIComponent( prefix );

      let albumName = dirName.replace(/\/$/, '');  // remove trailing slash
      albumName = albumName.replace( /.*\//, '');  // remove leading path

      return getHtml([
        '<li>',
        '<button onclick="changePage(\'' + fixedEncodeURIComponent( dirName ) + '\')">',
        albumName,
        '</button>',
        '</li>'
      ]);
    });

  var htmlTemplate = [];
  if (albums.length) {
    htmlTemplate = [
      '<h2>Albums</h2>',
      '<ul>', getHtml( albums ), '</ul>'
    ];
  }

  document.getElementById( elementId ).innerHTML = getHtml( htmlTemplate );
}

//----------------------------------------------------------------------
// display only the files in this directory (not other albums or nested files)
//----------------------------------------------------------------------
async function displayPhotos( files, bucketUrl, elementId ) {

  let anyPhotos = false;

  // need Promise.all because calling S3 on each elemrnt in array
  // can we do a batch instead?  FIXME
  var photos = await Promise.all( files.map( async function( photo ) {
    var photoKey = photo.Key;
    // skip dot files and $folder$ files (others?)
    if (photoKey.match( /\/\./ ) ||
        photoKey.match( /\.html/ ) ||
        photoKey.match( /\.css/ ) ||
        photoKey.match( /\.js/ ) ||
        photoKey.match( /\$folder\$/ ) )
    {
      return '';
    }

    anyPhotos = true;

    let photoUrl = await getTemporaryLink( albumBucketName, photoKey );
    // let photoUrl = bucketUrl + encodeURIComponent( photoKey );

    let thumbnail = "";
    if (photoKey.endsWith("jpg")) {
      thumbnail = '<img class="thumbnail" src="' + photoUrl + '"/>';
    }

    return getHtml([
      '<div class="photo">',
      '<a href="' + photoUrl + '" target="_blank">',
      thumbnail,
      '<div>',
      photoKey.replace( root, ''),
      '</div>',
      '</a>',
      '</div>',
    ]);

  }));

  var htmlTemplate = ["Select an album"];

  if (anyPhotos) {
    htmlTemplate = [
      "Click on pictures for full resolution",
      '<div class="photoAlbum">',
      getHtml(photos),
      '</div>',
      '<h2>',
      'End of Album',
      '</h2>',
      '<div>',
      '<button onclick="history.back()">Back</button>',
      '</div>',
    ];
  }

  document.getElementById( elementId ).innerHTML = getHtml( htmlTemplate );

  return true;
}
