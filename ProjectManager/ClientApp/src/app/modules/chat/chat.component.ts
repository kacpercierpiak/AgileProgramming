import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {MessageDto } from '../../Dto/MessageDto';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedService } from '../shared/sharedService';

@Component({
  selector: 'chat-module',
  templateUrl: './chat.component.html',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({      
         bottom: '-40px',
         height: '400px',
         width: '400px',
         position: 'fixed',
         right: '50px'
         
         
         
      })),
      state('closed', style({        
        bottom: '-500px',
        height: '0%',
        width: '20%',
        position: 'fixed'
      })),
      transition('open <=> closed', [
        animate('0.4s')
      ])
    ]),
  ],
  
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
  

  constructor(private chatService: ChatService, private shared: SharedService ) {}
 
  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe( (receivedObj: MessageDto) => { this.addToInbox(receivedObj);});  // calls the service method to get the new messages sent
                                                     
  }
  
  msgDto: MessageDto = new MessageDto();
  msgInboxArray: MessageDto[] = [];
  show: boolean = false;
  send(): void {
    if(this.msgDto) {
      this.msgDto.user = this.shared.UserName;
      if(this.shared.UserName === null)
        this.msgDto.user = "";
      else
      this.msgDto.user = this.shared.UserName;
      if(this.msgDto.user.length == 0){
        window.alert("Login are required.");
        return;
      } else {
        if(this.msgDto.msgText.length == 0)
        {
          window.alert("Message fields are required.");
          return;
        } else
        {
        this.chatService.broadcastMessage(this.msgDto);                   // Send the message via a service
        this.msgDto.msgText="";      
      }
      }
    }
  }

 toogle():void {
   if(!this.show && !this.shared.isAuthorized)
   {
    window.alert("Login are required.");
    return;
   }
  this.show =!this.show;
 }

  addToInbox(obj: MessageDto) {
    let newObj = new MessageDto();
    newObj.user = obj.user;
    newObj.msgText = obj.msgText;
    this.msgInboxArray.push(newObj);

  }
}
