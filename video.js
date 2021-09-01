var client=AgoraRTC.createClient({
    mode : 'rtc',
    codec : 'vp8'
})

var options = {
    appid: '9bce30e2a962401bb4b24fdb93a4abcf',
    uid: null,
    channel: null,
}

var localTrack = {
    videoTrack : null,
    audioTrack : null,
}

var localTrackState = {
    videoTrackEnabled: true,
    audioTrackEnabled: true
}

var remoteUsers = {
}


async function join(){

    $('#mic-btn').prop('disabled',false);
    $('#video-btn').prop('disabled',false);

    client.on('user-joined',handleUserJoined);
    client.on('user-published',handelUserPublished);
    client.on('user-left',handleUserLeft);

    options.uid = await client.join(options.appid,options.channel,null,null);

    localTrack.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localTrack.videoTrack = await AgoraRTC.createCameraVideoTrack();

    localTrack.videoTrack.play('local-player');

    await client.publish(Object.values(localTrack));
}

function handleUserJoined(user){
    const id = user.uid;
    remoteUsers[id]=user;

}

function handelUserPublished(user, mediaType){
    subscribe(user,mediaType);
}

async function subscribe(user, mediaType){
    const id = user.uid;

    await client.subscribe(user, mediaType);
    console.log('Subscribed to user: '+id);

    if(mediaType == 'video'){
        const remotePlayer = $(`
            <div id = "player-wrapper-${id}">
            <p class = "player-name"> remoteUser${id}</p>
            <div id = "player-${id}" class="player"></div>
            </div>
        `)

        $('#remote-playerlist').append(remotePlayer);

        user.videoTrack.play(`player-${id}`);
    }else if (mediaType == 'audio'){
        user.audioTrack.play();
    }
}

function handleUserLeft(user){
    const id = user.uid;
    delete remoteUsers[id];

    $(`#player-wrapper-${id}`).remove();
}


$('#join-form').submit(async function(e){
    e.preventDefault();

    options.channel=$('#channel').val();

    try{
        join();
    }
    catch(e){
        console.error(e);
    }
    finally{
        $('#join').attr('disabled',true);
        $('#leave').attr('disabled',false);
    }


})

async function leave(){

    for(trackName in localTrack){
        var track = localTrack[trackName];
        if (track){
            track.stop();
            track.close();
            $('#mic-btn').prop('disabled',true);
            $('#video-btn').prop('disabled',true);
            localTrack.tracjName = undefined;
        }
    }

    $('#join').attr('disabled',false);
    $('#leave').attr('disabled',true);

    remoteUsers={}

    $(`#remote-playerlist`).html('');

    await client.leave();
    console.log('Client has left');
}

$('#leave').click(function(e){
    leave();
})

//mute audio
async function muteAudio(){
    console.log('muted A');
    if(!localTrack.audioTrack){
        return;
    }

    await localTrack.audioTrack.setEnabled(false);
    localTrackState.audioTrackEnabled = false;
    $('#mic-btn').text('Unmute Audio')
}

//unmute audio
async function unMuteAudio(){
    console.log('unmuted A');
    if(!localTrack.audioTrack){
        return;
    }

    await localTrack.audioTrack.setEnabled(true);
    localTrackState.audioTrackEnabled = true;
    $('#mic-btn').text('Mute Audio')

}

//mute video
async function muteVideo(){
    console.log('muted V');
    if(!localTrack.videoTrack){
        return;
    }

    await localTrack.videoTrack.setEnabled(false);
    localTrackState.videoTrackEnabled = false;
    $('#video-btn').text('Unmute Video')
}

//unmite video
async function unMuteVideo(){
    console.log('unmuted V');
    if(!localTrack.videoTrack){
        return;
    }

    await localTrack.videoTrack.setEnabled(true);
    localTrackState.videoTrackEnabled = true;
    $('#video-btn').text('Mute Video')

}



//video button click
$('#video-btn').click(function(e){
    if(localTrackState.videoTrackEnabled){
        muteVideo();
    }
    else{
        unMuteVideo();
    }
});


//audio button click
$('#mic-btn').click(function(e){
    if(localTrackState.audioTrackEnabled){
        muteAudio();
    }
    else{
        unMuteAudio();
    }
});

