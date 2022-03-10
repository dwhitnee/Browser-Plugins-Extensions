/* global AWS */

// TODO: Create a whole tree structure on one page

var s3;
var identityPool = 'us-east-1:9b3a1bf8-38e5-4cd1-9f66-7d9025af8e5f';
var albumBucketName;  // passed into init()
var root = "";   // directory we are in

// https://console.aws.amazon.com/cognito/code/
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-browser-credentials-cognito.html

// Initialize the Amazon Cognito credentials provider (IdentityPool created elsewhere)
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPool,
});

// AWS nuts and bolts
function init( bucket ) {
  albumBucketName = bucket;
  s3 = new AWS.S3( {
      apiVersion: '2006-03-01',
      params: { Bucket: bucket }
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
    let query = document.location.search;
    root = decodeURIComponent( query.replace(/\?root=/,''));
  }
  console.log("Displaying " + root);

  document.getElementById('breadcrumb').innerText = root;
  if (!root) {
    document.getElementById("backButton").style.display = "none";
  }
  displayDirectory( root );
}


//----------------------------------------------------------------------
// Build HTML to show only the Albums, not photos themselves
//----------------------------------------------------------------------
function displayDirectory( root ) {
  root = root || '';

  s3.listObjects(
    { Prefix: root, Delimiter: '/' },
    function(err, data) {
      if (err) {
        return alert('There was an error accessing your albums: ' + err.message);
      } else {
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + albumBucketName + '/';

        displayAlbums( data.CommonPrefixes, "albums");  // directory names
        displayPhotos( data.Contents, bucketUrl, "photos");        // file contents of directory
      }
      return true;
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

      // if (dirName == root) {
      //   return "";
      // } else {
        return getHtml([
          '<li>',
          '<button onclick="changePage(\'' + fixedEncodeURIComponent( dirName ) + '\')">',
          albumName,
          '</button>',
          '</li>'
        ]);
      // };
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
function displayPhotos( files, bucketUrl, elementId ) {

  let anyPhotos = false;

  var photos = files.map( function( photo ) {
    var photoKey = photo.Key;
    // skip dot files and $folder$ files (others?)
    if (photoKey.match( /\/\./ ) ||
        photoKey.match( /index/ ) ||
        photoKey.match( /\.css/ ) ||
        photoKey.match( /\.js/ ) ||
        photoKey.match( /\$folder\$/ ) )
    {
      return '';
    }

    anyPhotos = true;

    var photoUrl = bucketUrl + encodeURIComponent( photoKey );
    return getHtml([
      '<div class="photo">',
      '<a href="' + photoUrl + '" target="_blank">',
      '<img class="thumbnail" src="' + photoUrl + '"/>',
      '<div>',
      photoKey.replace( root, ''),
      '</div>',
      '</a>',
      '</div>',
    ]);

  });

  // https://s3.amazonaws.com/dwhitnee-pictures/slides/Whitneys50s-70s/jpg%20large/Carousel%2001/slides%2FWhitneys50s-70s%2Fjpg%20large%2FCarousel%2001%2F1-001.jpg

  // https://s3.amazonaws.com/dwhitnee-pictures/slides%2FWhitneys50s-70s%2Fjpg%20large%2FSlide%20Tray%2016_1981%20thru%201983%2F16-013.jpg

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


//----------------------------------------------------------------------
// display only the files in this directory (not other albums or nested files)
//----------------------------------------------------------------------
function displayPhotos2( dir ) {
  var albumPhotosKey = dir;
  console.log("Viewing " + albumPhotosKey );

  // TODO: skip directories (collect directories in an array/hash

  s3.listObjects({ Prefix: albumPhotosKey }, function(err, data) {
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }
    // 'this' references the AWS.Request instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + '/';

    var albums = [];

    var photos = data.Contents.map( function( photo ) {
      var photoKey = photo.Key;
      // skip dot files
      if (photoKey.match( /\/\./ )) {
        return '';
      }

      var photoUrl = bucketUrl + encodeURIComponent(photoKey);
      return getHtml([
        '<div class="photo">',
          '<a href="' + photoUrl + '" target="_blank">',
           '<img class="thumbnail" src="' + photoUrl + '"/>',
          '<div>',
              photoKey.replace(albumPhotosKey, ''),
          '</div>',
          '</a>',
          '</div>',
      ]);

    });

    var message = photos.length ? 'Click on pictures for full resolution': '<p>There are no photos in this album.</p>';

    var htmlTemplate = [
      message,
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

    document.getElementById('photos').innerHTML = getHtml( htmlTemplate );

    return true;
  });

}
