import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {MessageDto } from '../../Dto/MessageDto';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedService } from '../shared/sharedService';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { map } from 'rxjs/operators';

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
  

  constructor(private chatService: ChatService, private authService: AuthorizeService ) {}
  private isAuth: boolean = false;
  private currentUser: string;
  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe( (receivedObj: MessageDto) => { this.addToInbox(receivedObj);});  // calls the service method to get the new messages sent
    this.authService.user$.pipe(
      map((user) => {
       
        if (user) {                
          this.currentUser = user.name;
          this.isAuth = true;    
          return true;        
        } else return false;
      })      
    ).subscribe();                                                
  }
  
  msgDto: MessageDto = new MessageDto();
  msgDtoSending: MessageDto = new MessageDto();
  msgInboxArray: MessageDto[] = [];
  show: boolean = false;
  send(msg:string): void {     
    this.msgDtoSending.msgText = msg;   
    this.msgDto.msgText = "";
    this.msgDto.user = this.currentUser;

    if(this.msgDtoSending) {
      this.msgDtoSending.user = this.currentUser;
      if(this.currentUser === null)
      this.msgDtoSending.user = "";
      
      if(this.msgDtoSending.user.length == 0){
        window.alert("Login are required.");
        return;
      } else {
        if(this.msgDtoSending.msgText.length == 0)
        {
          window.alert("Message fields are required.");
          return;
        } else
        {
        this.chatService.broadcastMessage(this.msgDtoSending);                 // Send the message via a service
      }
      }
    }
  }

 toogle():void {
   if(!this.show && !this.isAuth)
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
