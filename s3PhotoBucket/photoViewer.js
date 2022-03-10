/* global AWS */

// TODO: Create a whole tree structure on one page

var s3;
var identityPool = 'us-east-1:9b3a1bf8-38e5-4cd1-9f66-7d9025af8e5f';
var albumBucketName;  // passed into init()

// https://console.aws.amazon.com/cognito/code/
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-browser-credentials-cognito.html

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPool,
});


function init( bucket ) {
  albumBucketName = bucket;
  s3 = new AWS.S3( {
      apiVersion: '2006-03-01',
      params: { Bucket: bucket }
    });
}


//----------------------------------------------------------------------
// A utility function to create HTML.
//----------------------------------------------------------------------
function getHtml(template) {
  return template.join('\n');
}

//----------------------------------------------------------------------
// List the photo albums that exist in the bucket.
// TODO: Find all subdirs and list those
//----------------------------------------------------------------------
function listAlbums( prefix ) {
//  var prefix = "slides/Whitneys50s-70s/jpg large";

  prefix = prefix || '';

  s3.listObjects(
    { Prefix: prefix,
      Delimiter: '/' },
    function(err, data) {
      if (err) {
        return alert('There was an error listing your albums: ' + err.message);
      } else {
        var albums = data.CommonPrefixes.map(
          function( commonPrefix ) {
            var prefix = commonPrefix.Prefix;
            var albumName = decodeURIComponent( prefix.replace(/\/$/, '') );
            return getHtml([
                             '<li>',
                             '<button onclick="viewAlbum(\''+albumName+'\')\">',
                             albumName,
                             '</button>',
                             '</li>'
                           ]);
          });
        var message = albums.length ?
          getHtml([
                    '<p>Click on an album name to view it.</p>'
                  ]) :
          '<p>You do not have any albums. Please Create album.';
        var htmlTemplate = [
          '<h2>Albums</h2>',
          message,
          '<ul>',
          getHtml(albums),
          '</ul>'
        ];
        document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
      }
      return true;
    });
}

// function showPicture( url ) {
//  window.open( url, '_blank');
// }

//----------------------------------------------------------------------
// Show the photos that exist in an album.
// TODO: also show subdirs as another album
//----------------------------------------------------------------------
function viewAlbum( albumName ) {
//  var albumPhotosKey = encodeURIComponent(albumName) + '/';
  var albumPhotosKey = albumName + '/';
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

      let album = photoKey.match( /(.*)\/.*/ );
      if (album) {
        albums[ album[1] ] = true;
        // return '';
      }

      var photoUrl = bucketUrl + encodeURIComponent(photoKey);
      return getHtml([
        '<div class="photo">',
          '<a href="' + photoUrl + '">',
//           '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
          '<div>',
              photoKey.replace(albumPhotosKey, ''),
          '</div>',
          '</a>',
          '</div>',
      ]);

    });

    console.log( albums );
    Object.keys(albums).map( function( album ) {
      console.log( album );
    });

    // for (let i=0; i < albums.length; i++) {
    //   listAlbums( albums[i] );
    // }


    var message = photos.length ? '': '<p>There are no photos in this album.</p>';

    var htmlTemplate = [
      '<div>',
        '<button onclick="listAlbums()">',
          'Back To Albums',
        '</button>',
      '</div>',
      '<h2>',
        'Album: ' + albumName,
      '</h2>',
      message,
      '<div class="photoAlbum">',
        getHtml(photos),
      '</div>',
      '<h2>',
        'End of Album: ' + albumName,
      '</h2>',
      '<div>',
        '<button onclick="listAlbums()">',
          'Back To Albums',
        '</button>',
      '</div>',
    ];

    document.getElementById('viewer').innerHTML = getHtml( htmlTemplate );

    return true;
  });
}
