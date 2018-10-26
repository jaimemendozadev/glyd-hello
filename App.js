import React, {Component} from 'react';
import {Text, View, TextInput, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';

const defaultState = {
  toggleInput: false,
  textValue: "Enter something",
  finalMsg: "",
  latitude: null, 
  longitude: null,
  imgUrl: "https://media2.giphy.com/media/3o7abooVPgeGpknXpu/giphy.gif"
}


const DismissKeyboard = ({children}) =>(
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
) 

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = defaultState;
  }

  displayInput = () => {
    const {toggleInput} = this.state;
    this.setState({toggleInput: !toggleInput});
  }

  handleInputChange = text => {
    this.setState({
      textValue: text
    });
  }

  handleCoordinates = position => {
    const {coords} = position;
    const {latitude, longitude} = coords;

    this.setState({
      latitude, 
      longitude,
      toggleInput: false
    });
    
  }

  submitInput = () => {

    const {textValue} = this.state;

    this.setState({textValue: "Enter something", finalMsg: textValue},
      () => {
        navigator.geolocation.getCurrentPosition(
          this.handleCoordinates,
          error => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
      })
  }

  checkInput = typeOfInput => {
    console.log("inside checkInput")
    const {textValue} = this.state;
    const defaultText = "Enter something";
   

    if(typeOfInput === "onFocus") {
      if(textValue === defaultText) {
        this.setState({textValue: ""});
      } 

    }

    if(typeOfInput === "onBlur") {
      if(textValue.length === 0) {
        this.setState({textValue: defaultText})
      }
    }
    
  }

  displayMessage = (latitude, longitude) => {
    const {imgUrl, finalMsg} = this.state;
    if(latitude !== null && longitude != null) {
      return (
        <View style={{width: "100%", padding: 10}}>
          <Text style={styles.msgStyling}>{finalMsg}</Text>
          <Text style={styles.msgStyling}>Your current location is:</Text> 
          <Text style={styles.msgStyling}>latitude: {latitude}</Text>
          <Text style={styles.msgStyling}>longitude: {longitude}</Text>
          <Image style={{width: "100%", height: "60%"}} source={{uri: imgUrl}} />
        </View>
      )
    }
  }

  render() {
    const {textValue, toggleInput, latitude, longitude} = this.state;
    
    const showTextView = toggleInput === true ? {display: "none"} : null; 

    const showTextInputView = toggleInput === true ? {display: "flex"} : {display: "none"};
    
    return (
      <DismissKeyboard>
        <View style={styles.container}>
       
          <View style={[showTextView, styles.textViewContainer]}>
            <Text onPress={this.displayInput} style={styles.helloHeader}>Hello World</Text>
            {this.displayMessage(latitude, longitude)}  
          </View>
               
  
          <View style={showTextInputView}>
  
            <TextInput 
              onFocus={() => this.checkInput("onFocus")} 
              onBlur={() => this.checkInput("onBlur")} 
              onChangeText={this.handleInputChange} 
              style={styles.textInput} 
              value={textValue} 
            />
            <TouchableOpacity style={styles.button} onPress={this.submitInput}>
              <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </DismissKeyboard>
      
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  helloHeader: {
    fontSize: 50, 
    marginBottom: 10
  },

  textViewContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "pink",
    height: "50%",
    width: "100%"
  },
  textInput: {
    marginTop: 20,
    height: 50,
    width: 300,
    fontSize: 30,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center"
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#FC0D1B",
    borderColor: "#FC0D1B",
    height: 50,
  },
  buttonText: {
    top: 10, 
    fontSize: 20, 
    color: "white", 
    textAlign: "center"
  },
  msgStyling: {
    fontSize: 20,
    marginBottom: 10
  }
}
