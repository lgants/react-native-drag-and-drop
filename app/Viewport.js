import React, {Component} from "react";
import {View, Text, StyleSheet, PanResponder, Animated, Dimensions} from "react-native";

export default class Viewport extends Component{
    constructor(props){
        super(props);

        this.state = {
            // create an instance of Animated.ValueXY, whcih will take care of interpolating X and Y values
            pan : new Animated.ValueXY(),
            showDraggable   : true,
            dropZoneValues  : null
        };
        // PanResponder, which is responsible for doing the dragging, sets the handlers when the user moves and releases the element
        // Animated.spring method runs the animation
        // first parameter (i.e. this.state.pan) accepts the animation values
        // second parameter (i.e. {toValue:{x:0,y:0}}) is a configuration object that defines the toValue, which is the origin coordinates
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder : () => true,
            onPanResponderMove           : Animated.event([null,{ //the handler will trigger when the element is moving
                dx : this.state.pan.x,
                dy : this.state.pan.y
            }]),
            onPanResponderRelease           : (e, gesture) => {
              if(this.isDropZone(gesture)){ //Step 1
                  this.setState({
                      showDraggable : false //Step 3
                  });
              }else{
                  Animated.spring(
                      this.state.pan,
                      {toValue:{x:0,y:0}}
                  ).start();
              }
            }
        });
    }

    isDropZone(gesture){
        var dz = this.state.dropZoneValues;
        return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
    }

    setDropZoneValues(event){
        this.setState({
            dropZoneValues : event.nativeEvent.layout
        });
    }

    render(){
        return (
            <View style={styles.mainContainer}>
                <View style={styles.dropZone}>
                    <Text style={styles.text}>Drop me here!</Text>
                </View>

                {this.renderDraggable()}
            </View>
        );
    }

    render(){
        return (
            <View style={styles.mainContainer}>
                <View
                    onLayout={this.setDropZoneValues.bind(this)}
                    style={styles.dropZone}>
                    <Text style={styles.text}>Drop me here!</Text>
                </View>

                {this.renderDraggable()}
            </View>
        );
    }

    renderDraggable(){
        // renders green circle based on showDraggable value
        if(this.state.showDraggable){
            return (
                <View style={styles.draggableContainer}>
                    <Animated.View
                        {...this.panResponder.panHandlers}
                        style={[this.state.pan.getLayout(), styles.circle]}>
                        <Text style={styles.text}>Drag me!</Text>
                    </Animated.View>
                </View>
            );
        }
    }
}




let CIRCLE_RADIUS = 36;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
    },
    dropZone    : {
        height         : 100,
        backgroundColor:'#2c3e50'
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
    },
    circle      : {
        backgroundColor     : '#1abc9c',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS
    }
});
