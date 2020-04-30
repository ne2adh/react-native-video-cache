import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, View, PermissionsAndroid, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';
import * as RNFS from 'react-native-fs';

export async function request_storage_runtime_permission() {
 
	try {
	  const granted = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
		{
		  'title': 'ReactNativeCode Storage Permission',
		  'message': 'ReactNativeCode App needs access to your storage to download Photos.'
		}
	  )
	  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
   
		Alert.alert("Storage Permission Granted.");
	  }
	  else {
   
		Alert.alert("Storage Permission Not Granted");
   
	  }
	} catch (err) {
	  console.warn(err)
	}
  }


export default class WatchVideo extends Component {
  
  home(){
    Actions.home();
  }

  videos(){
    Actions.videos();
  }
  onBuffer(bufferObj) {
	console.log('buffering', bufferObj.isBuffering);
}

videoError(error) {
	console.log('video error:', error);
}
  constructor(props) {
    super(props);
    this.state = {
		videoUri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		path:''
	}

  }
  getVideoUrl = (url, filename) => {
	return new Promise((resolve, reject) => {
	  RNFS.readDir(RNFS.DocumentDirectoryPath)
		.then(result => {
		  result.forEach(element => {
			if (element.name == filename.replace(/%20/g, "_")) {
			  resolve(element.path);
			}
		  });
		})
		.catch(err => {
		  reject(url);
		});
	});
  };
  async componentDidMount() {
 
	await request_storage_runtime_permission()
	
	const    AppFolder    =     'DirNameyouwant';
 const DirectoryPath= RNFS.ExternalStorageDirectoryPath +'/'+ AppFolder;
 RNFS.mkdir(DirectoryPath);
 //console.log(DirectoryPath)
 //const path = RNFS.DocumentDirectoryPath;
 const videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; 
	let filename = videoUrl.replace(/^.*[\\\/]/, '');
	
	let path_name = DirectoryPath +'/'+filename;
	this.setState({path: path_name});
	RNFS.exists(path_name).then(exists => {
		if (exists) {
		  console.log("Already downloaded");
		} else {
		  RNFS.downloadFile({
			fromUrl: videoUrl,
			toFile: path_name.replace(/%20/g, "_"),
			background: true
		  })
			.promise.then(res => {
			  console.log("File Downloaded", res);
			})
			.catch(err => {
			  console.log("err downloadFile", err);
			});
		}
	  });
	  this.getVideoUrl(videoUrl, filename)
  .then(res => {
    this.setState({ videoUri: res });
  })
  .catch(url => {
    this.setState({ videoUri: url });
  });
  }
  /* componentDidMount(){
	 const videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; 
	let filename = videoUrl.substring(deviceuri.lastIndexOf("/") + 1, videoUrl.length);
	let path_name = RNFS.DocumentDirectoryPath + filename;
  } */


  render() {
	  console.log(this.state.path);
    return (
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.webview}>
            <WebView
              source={{ uri: "https://www.youtube.com/embed/"+this.props.video_url}}
              startInLoadingState={true}
            />
            </View>
			<View style={styles.webview2}>
			<Video source={{uri: this.state.videoUri}}  
                        ref={(ref) => {
                            this.player = ref
                        }}                                      
                        onBuffer={this.onBuffer}               
                        onError={this.videoError}     
                        controls        
                        style={styles.backgroundVideo} />
			</View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  webview: {
    flex: 1,
  },
  webview2: {
    flex: 1,
  },
   backgroundVideo: {
      flex: 1
    },
});