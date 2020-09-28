import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert} from 'react-native';
import {Card,ListItem,Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class MyBarters extends React.Component {
    static navigationOptions = {header: null}

    constructor(){
        super();
        this.state = {
            donorId: firebase.auth().currentUser.email,
            allDonations: [],
            donorName: "",
        }
        this.requestRef = null;
    }

    getAllDonations=()=>{
        this.requestRef = db.collection("allDonations")
        .where("donorID","==",this.state.donorId)
        .onSnapshot((snapshot)=>{
            var allDonations = snapshot.docs.map(document=>document.data());
            this.setState({allDonations: allDonations});
        })
    }

    getDonorDetails=(donorId)=>{
      db.collection("users").where("emailID","==", donorId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          this.setState({
            donorName : doc.data().firstName + " " + doc.data().lastName
          })
        });
      })
  }

    componentDidMount(){
        this.getAllDonations();
        this.getDonorDetails(this.state.donorId)
    }

    sendNotification=(itemDetails, requestStatus)=>{
      var requestId = itemDetails.requestID;
      var donorId = itemDetails.donorID;
      db.collection("allNotifications")
      .where("requestID","==",requestId)
      .where("donorID","==",donorId).get()
      .then((snapshot)=>{
          snapshot.forEach((doc)=>{
              var message = "";
              if(requestStatus === "item Sent"){
                  message = this.state.donorName + "sent you the item";
              }
              else {
                  message = this.state.donorName + "has shown interest in donating the item";
              }

              db.collection("allNotifications").doc(doc.id).update({
                  "message": message,
                  "notificationStatus": "unread",
                  "date": firebase.firestore.FieldValue.serverTimestamp(),
              })
          })
      })
  }

  senditem=(itemDetails)=>{
    if(itemDetails.requestStatus === "item Sent"){
        var requestStatus = "Donor Interested";
        db.collection("allDonations").doc(itemDetails.docID)
        .update({
            "requestStatus": "Donor Interested"
        })
        this.sendNotification(itemDetails,requestStatus);
    }
    else { 
        var requestStatus = "item Sent";
        db.collection("allDonations").doc(itemDetails.docID)
        .update({
            "requestStatus": "item Sent"
        })
        this.sendNotification(itemDetails,requestStatus);
    }
  }

    keyExtractor =(item,index)=> index.toString();

    renderItem=({item,i})=>(
        <ListItem 
        key={i}
        title={item.itemName}
        subtitle = {"Requested by: " + item.requestedBy + "\nStatus:" + item.requestStatus}
        leftElement={<Icon icon name="list" color="#696969"
        titleStyle={{color: "black", fontWeight: "bold"}}/>}
        rightElement={
        <TouchableOpacity 
        style={[styles.button, 
                {backgroundColor: item.requestStatus==="item Sent" ? "green" : "#ff5722"}]}
        onPress={()=>{
          this.senditem(item);
        }}>
            <Text style={{color: "white"}}>
                {item.requestStatus === "item Sent" ? "item Sent" : "Send item"}
            </Text>
        </TouchableOpacity>}
        bottomDivider />
    )

    componentWillUnmount(){
        this.requestRef();
    }

    render(){
        return(
          <View style={{flex:1}}>
            <MyHeader navigation={this.props.navigation} title="My Donations"/>
            <View style={{flex:1}}>
              {
                this.state.allDonations.length === 0
                ?(
                  <View style={styles.subtitle}>
                    <Text style={{ fontSize: 20}}>List of all item Donations</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allDonations}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }   
}

const styles = StyleSheet.create({
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })
  