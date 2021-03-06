'use strict';

import React, {
  Component,
} from 'react';
import {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
} from 'react-native';

import Global from './global';
var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');


var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}

class GiftedMessengerContainer extends Component {

  constructor(props) {
    super(props);

    this._isMounted = false;
    this._messages = this.getInitialMessages();

    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      typingMessage: '',
      allLoaded: false,
    };

  }

  componentDidMount() {
    this._isMounted = true;

    setTimeout(() => {
      this.setState({
        typingMessage: 'React-Bot is typing a message...',
      });
    }, 1000); // simulating network

    setTimeout(() => {
      this.setState({
        typingMessage: '',
      });
    }, 3000); // simulating network


    setTimeout(() => {
      this.handleReceive({
        text: 'Hello Awesome Developer',
        name: 'React-Bot',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      });
    }, 3300); // simulating network
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getInitialMessages() {
    return [
      {
        text: 'Are you building a chat app?',
        name: 'React-Bot',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2016, 3, 14, 13, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
      {
        text: "Yes, and I use Gifted Messenger!",
        name: 'Awesome Developer',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2016, 3, 14, 13, 1),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
    ];
  }

  setMessageStatus(uniqueId, status) {
    let messages = [];
    let found = false;

    for (let i = 0; i < this._messages.length; i++) {
      if (this._messages[i].uniqueId === uniqueId) {
        let clone = Object.assign({}, this._messages[i]);
        clone.status = status;
        messages.push(clone);
        found = true;
      } else {
        messages.push(this._messages[i]);
      }
    }

    if (found === true) {
      this.setMessages(messages);
    }
  }

  setMessages(messages) {
    this._messages = messages;

    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {

    // Your logic here
    // Send message.text to your server
    message.position = 'left';
    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation

    console.log(message);
    this.setMessages(this._messages.concat(message));

    // mark the sent message as Seen
    setTimeout(() => {
      this.setMessageStatus(message.uniqueId, 'Seen'); // here you can replace 'Seen' by any string you want
    }, 1000);

    // if you couldn't send the message to your server :
    // this.setMessageStatus(message.uniqueId, 'ErrorButton');
  }

  onLoadEarlierMessages() {

    // display a loader until you retrieve the messages from your server
    this.setState({
      isLoadingEarlierMessages: true,
    });

    // Your logic here
    // Eg: Retrieve old messages from your server

    // IMPORTANT
    // Oldest messages have to be at the begining of the array
    var earlierMessages = [
      {
        text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
        name: 'React-Bot',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2016, 0, 1, 20, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      }, {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
        name: 'Awesome Developer',
        image: null,
        position: 'right',
        date: new Date(2016, 0, 2, 12, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
    ];

    setTimeout(() => {
      this.setMessages(earlierMessages.concat(this._messages)); // prepend the earlier messages to your list
      this.setState({
        isLoadingEarlierMessages: false, // hide the loader
        allLoaded: true, // hide the `Load earlier messages` button
      });
    }, 1000); // simulating network

  }

  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  }

  onErrorButtonPress(message = {}) {
    // Your logic here
    // re-send the failed message

    // remove the status
    this.setMessageStatus(message.uniqueId, '');
  }

  // will be triggered when the Image of a row is touched
  onImagePress(message = {}) {
    // Your logic here
    // Eg: Navigate to the user profile
  }

  render() {
    return (
      <View>
        <View style={{height: 50, backgroundColor: Global.COLOR.BACKGROUND, borderBottomWidth: 1, borderBottomColor: Global.COLOR.BORDER}}>
        </View>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          styles={{
            bubbleRight: {
              marginLeft: 200,
              backgroundColor: '#007aff',
            },
          }}

          autoFocus={false}
          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}
          onErrorButtonPress={this.onErrorButtonPress.bind(this)}
          maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT - 50}

          loadEarlierMessagesButton={!this.state.allLoaded}
          onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

          senderName='Awesome Developer'
          senderImage={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          onImagePress={this.onImagePress}
          displayNames={true}

          placeholder='Say something nice...'
          placeholderTextColor={Global.COLOR.LIGHTTEXT}
          parseText={true} // enable handlePhonePress, handleUrlPress and handleEmailPress
          handlePhonePress={this.handlePhonePress}
          handleUrlPress={this.handleUrlPress}
          handleEmailPress={this.handleEmailPress}
          displayNamesInsideBubble={true}
          styles={{
            bubbleLeft: {
              flex: 1,
              backgroundColor: 'transparent',
              alignSelf: 'flex-start',
            },
            bubble: {
              borderRadius: 0,
              paddingLeft: 7,
              paddingRight: 0,
              paddingBottom: 10,
              paddingTop: 0,
            },
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: 'transparent',
              alignSelf: 'flex-end',
            },
            textRight: {
              color: Global.COLOR.LIGHTTEXT,
              fontSize: 11,
              fontStyle: 'italic'
            },
            rowContainer: {
              flexDirection: 'row',
              paddingHorizontal: 15
            },
            image: {
              alignSelf: 'center',
              borderRadius: 4,
              width: 40,
              height: 40,
              borderWidth: 1,
              borderColor: Global.COLOR.BORDER
            },
            imagePosition: {
              height: 30,
              width: 30,
              alignSelf: 'flex-end',
              marginLeft: 0,
              marginRight: 8,
            },
            date: {
              fontSize: 12,
              textAlign: 'center',
              fontWeight: '600',
              marginTop: 8,
              marginBottom: 8,
              fontFamily: Global.FONT.IOS,
              color: Global.COLOR.BORDER
            },
            container: {
              backgroundColor: Global.COLOR.BACKGROUND
            },
            textInputContainer: {
              height: 60,
              flexDirection: 'row',
              paddingLeft: 10,
              paddingRight: 10,
              borderTopWidth: 1,
              alignItems: 'center',
              borderColor: Global.COLOR.BORDER
            },
            textInput: {
              alignSelf: 'center',
              height: 30,
              width: 100,
              flex: 1,
              padding: 0,
              margin: 0,
              fontSize: 15,
              color: '#FFF',
              backgroundColor: 'transparent',
              fontFamily: Global.FONT.IOS
            },
            sendButton: {
              marginTop: 0,
              marginLeft: 10,
              color: '#FFF',
              fontFamily: Global.FONT.IOS,
              fontWeight: '500',
              fontSize: 14
            },
            sendButtonDisabled: {
              color: Global.COLOR.LIGHTTEXT
            },
            name: {
              color: Global.COLOR.LIGHTTEXT,
              fontSize: 16,
              marginLeft: 55,
              marginBottom: 5,
              fontFamily: Global.FONT.IOS,
              fontWeight: '600'
            },
            text: {
              color: '#FFF',
              fontSize: 16,
              fontWeight: '400',
              fontFamily: Global.FONT.IOS,
            },
            loadEarlierMessagesButton: {
              color: Global.COLOR.MAIN,
              fontSize: 14,
              fontWeight: '600',
              fontFamily: Global.FONT.IOS,
            }
          }}
          isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}

          typingMessage={this.state.typingMessage}
        />
      </View>
    );
  }

  handleUrlPress(url) {
    Linking.openURL(url);
  }

  // TODO
  // make this compatible with Android
  handlePhonePress(phone) {
    if (Platform.OS !== 'android') {
      var BUTTONS = [
        'Text message',
        'Call',
        'Cancel',
      ];
      var CANCEL_INDEX = 2;

      ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true);
            break;
          case 1:
            Communications.text(phone);
            break;
        }
      });
    }
  }

  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }

}


module.exports = GiftedMessengerContainer;
