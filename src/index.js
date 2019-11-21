import React from "react";
import {Text, TextInput, View,Image, Animated, Platform,Dimensions, AsyncStorage} from "react-native";

const { width, height } = Dimensions.get("window");

const CToast = ({Msg,bg, ...otherProps}) => {
    return (
      <View  style={{ paddingHorizontal: 20, paddingVertical: 50, width: "100%",}}>
       
        <View style={{alignItems:"center",justifyContent:"center", backgroundColor: bg, width: "100%", paddingVertical: 16, borderRadius: 10 }}>
          <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center"}} >
            <Image source={require("../assets/tickwhite.png")} style={{ height: 20, width:20 }} />    
            <Text style={{marginLeft: 10,width: "80%",fontSize: 18, color: "white" }}>{Msg}</Text>
          </View>
       
        </View>
     
      </View>
    );
  };

  const POSITION = {
    ABSOLUTE: "absolute",
    BOTTOM: "bottom",
    TOP: "top",
  };



export default class index extends React.Component{
    
    constructor(props) {
        super(props);
    
        this.state = {
          fadeAnim: new Animated.Value(0),
          keyboardHeight: 0,
          isKeyboardVisible: false,
          position: POSITION.BOTTOM,
          text: "",
          alertBG: "#01b187",
          updatedOrCancelled: false,
          versionControlData: {},
          versionControlModalVisible: false,
        };
      }

      componentDidMount(){
        this.showToast({
            text: this.props.text,
            buttonText: "",
            duration: 2000,
            alertBG: this.props.backgroundColor,
          });
      }

      showToast(config) {
        this.setState({
          text: config.text,
          position: config.position ? config.position : POSITION.BOTTOM,
          alertBG: config.alertBG,
        });
        // If we have a toast already open, cut off its close timeout so that it won't affect *this* toast.
        if (this.closeTimeout) {
          clearTimeout(this.closeTimeout);
        }
        // Set the toast to close after the duration.
        if (config.duration !== 0) {
          const duration = config.duration > 0 ? config.duration : 1500;
          this.closeTimeout = setTimeout(this.closeToast.bind(this, "timeout"), duration);
        }
        // Fade the toast in now.
        Animated.timing(this.state.fadeAnim, {
          toValue: 1,
          duration: 200,
        }).start();
      }

      getTop() {
        if (Platform.OS === "ios") {
          if (this.state.isKeyboardVisible) {
            return this.state.keyboardHeight;
          }
          return 3;
        }
        return 0;
      }

      closeModal(reason) {
        const {onClose} = this.state;
        if (onClose && typeof onClose === "function") {
          onClose(reason);
        }
      }
    
      closeToast(reason) {
        clearTimeout(this.closeTimeout);
        Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 200,
        }).start(this.closeModal.bind(this, reason));
      }

    getToastStyle() {
        return {
          position: "absolute",
          opacity: this.state.fadeAnim,
          width: "100%",
          elevation: 9,
    
          justifyContent: "flex-end",
          top: this.state.position === POSITION.TOP ? 40 : undefined,
          bottom: this.state.position === POSITION.BOTTOM ? this.getTop() : undefined,
        };
      }

    render(){
        return(
            <View>
                <View style={{height:"100%",}}>

                </View>
        <Animated.View style={this.getToastStyle()}>
              <CToast Msg={this.state.text} bg={this.state.alertBG?this.state.alertBG:"#01b187"} />
            </Animated.View>
            </View>
        )
        
    }
}