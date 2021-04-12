import * as React from 'react';
import * as FileSystem from 'expo-file-system';
import { Text, View, StyleSheet, Button, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import AudioRecord from 'react-native-audio-record';

export default function App() {
  const options = {
    sampleRate: 16000, // default 44100
    channels: 1, // 1 or 2, default 1
    bitsPerSample: 16, // 8 or 16, default 16
    audioSource: 6, // android only (see below)
    wavFile: 'test.wav', // default 'audio.wav'
  };

  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    FileSystem.getContentUriAsync(uri)
      .then((result) => {
        console.log(`content uri success ${result}`);
        let example = result;
      })
      .catch((error) => console.log(error));
  }

  async function start() {
    AudioRecord.init(options);
    setRecording(recording);
    AudioRecord.start();
  }

  async function stop() {
    setRecording(undefined);
    AudioRecord.stop();
    audioFile = await AudioRecord.stop();
  }

  function show() {
    AudioRecord.on('data', (data) => {
      console.log('audioFile is ', audioFile);
      console.log('data is', data);
    });
  }
  return (
    <View style={styles.container}>
      <Text>Audio Testing</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stop : start}
      />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={show}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
