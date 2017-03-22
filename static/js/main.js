$(function(){

  var ap;

  // Update playlist.
  getPlayLists(function(res, err){
    if(err != null)
      return console.log(err);
    updatePlaylists(res);
  });

  // Change playlist.
  $('#playlists').on('click', '.list-group-item', function(e){
    getPlayList(e.target.text, function(res, err){
      if(err != null)
        return console.log(err)
      ap = new APlayer({
        element: document.getElementById('player1'),
        narrow: false,
        autoplay: false,
        showlrc: 0,
        mutex: true,
        theme: '#e6d0b2',
        mode: 'random',
        preload: 'metadata',
        listmaxheight: '513px',
        music: res
      });
    });
  });

  $('#scan-button').on('click', function(){
    scanPlaylist(function(res, err){
     updatePlaylists(res); 
    });
  });

  $('#download-button').on('click', function(){
    var url = $('#url').val();
    var name = $('#name').val();
    var playlistName = $('#playlistName').val();
    var music = {
      url: url,
      playlistName: playlistName,
      name: name
    };
    downloadMusic(function(res, err){
      if(err != null)
        return
      $('.message').append('<p>Downloaded ' + res.name + '</p>');
    }, music);
  });

  $('#add-playlist-button').on('click', function(){
    var name = $('#plname').val();
    addPlaylist(function(res, err){
      if(err != null)
        return console.log(err);
    }, {
      name: name
    });
  });

  function addPlaylist(callback, data){
    $.ajax({
      type: 'POST',
      url: '/addplaylist',
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data)
    }).done(function(res, textStatus, jqXHR){
      callback(res, null);
    }).fail(function(jqXHR, textStatus, errorThrown){
      callback(null, errorThrown);
    });
  }

  function downloadMusic(callback, music){
    $.ajax({
      type: 'POST',
      url: '/download',
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(music)
    }).done(function(res, textStatus, jqXHR){
      callback(res, null);
    }).fail(function(jqXHR, textStatus, errorThrown){
      callback(null, errorThrown);
    })
  }

  function updatePlaylists(res){
    $('#playlists').empty();
    $('#playlistName').empty();
    for(var i = 0; i<res.length; i++){
      $('#playlists').append('<a href="#" class="list-group-item">' + res[i] + '</a>');
      $('#playlistName').append('<option>' + res[i] + '</option>');
    }
  }

  function getPlayLists(callback){
  $.ajax({
    type: 'GET',
    url: '/playlists',
    cache: false,
    dataType: 'json'
  }).done(function(res, textStatus, jqXHR){
    callback(res, null);
  }).fail(function(jqXHR, textStatus, errorThrown){
    callback(null, errorThrown);
  });
}

  function scanPlaylist(callback){
    $.ajax({
      type: 'GET',
      url: '/scan',
      cache: false,
      dataType: 'json'
    }).done(function(res, textStatus, jqXHR){
      callback(res, null);
    }).fail(function(jqXHR, textStatus, errorThrown){
      callback(null, errorThrown);
    });
  } 

  function getPlayList(name, callback){
    url = '/playlist/' + name;
    $.ajax({
      type: 'GET',
      url: url,
      cache: false,
      dataType: 'json'
    }).done(function(res, textStatus, jqXHR){
      callback(res, null);
    }).fail(function(jqXHR, textStatus, errorThrown){
      callback(null, errorThrown);
    });
  }
});
