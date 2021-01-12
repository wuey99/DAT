//------------------------------------------------------------------------------------------
import * as SFS2X from "sfs2x-api";
import { SFSManager } from '../../engine/sfs/SFSManager';
import { XSignal } from '../../engine/signals/XSignal';
import { XType } from "../../engine/type/XType";

//------------------------------------------------------------------------------------------	
	export class MessagingManager {	
        public static self:MessagingManager;

        public m_sfsRoom:SFS2X.SFSRoom;
        public m_sfsRoomManager:SFS2X.SFSRoomManager;

        public m_sfsUser:SFS2X.SFSUser;
        public m_sfsUserManager:SFS2X.SFSUserManager;
    
        public m_readySignal:Map<number, XSignal>;
        public m_completeSignal:Map<number, XSignal>;
        public m_triggerSignal:Map<number, XSignal>;
        public m_screenChangeSignal:Map<number, XSignal>;
        
        public static READY_SIGNAL:string = "ready";
        public static COMPLETE_SIGNAL:string = "complete";
        public static TRIGGER_SIGNAL:string = "trigger";
        public static SCREENCHANGE_SIGNAL:string = "screen-change";

        public static ALL_PLAYERS:number = -1;
        public static ALL_IN_ROOM:number = -2;

    //------------------------------------------------------------------------------------------
        public static instance ():MessagingManager {
            if (MessagingManager.self == null) {
                new MessagingManager ();
            }   

            return MessagingManager.self;
        }

    //------------------------------------------------------------------------------------------
        constructor () {
            MessagingManager.self = this;
        }

    //------------------------------------------------------------------------------------------
        public setup (__sfsUser:SFS2X.SFSUser):void {
            this.m_sfsUser = __sfsUser;
            this.m_sfsUserManager = __sfsUser.getUserManager ();

            this.m_readySignal = new Map<number, XSignal> ();
            this.m_completeSignal = new Map<number, XSignal> ();
            this.m_triggerSignal = new Map<number, XSignal> ();
            this.m_screenChangeSignal = new Map<number, XSignal> ();

            SFSManager.instance ().addEventListener (SFS2X.SFSEvent.PRIVATE_MESSAGE, this.onPrivateMessage.bind (this));
        }

    //------------------------------------------------------------------------------------------
        public cleanup ():void {
            XType.forEach (this.m_readySignal,
                (__userId:number) => {
                    this.m_readySignal.get (__userId).removeAllListeners ();
                }
            );

            XType.forEach (this.m_completeSignal,
                (__userId:number) => {
                    this.m_completeSignal.get (__userId).removeAllListeners ();
                }
            );

            XType.forEach (this.m_triggerSignal,
                (__userId:number) => {
                    this.m_triggerSignal.get (__userId).removeAllListeners ();
                }
            );

            XType.forEach (this.m_screenChangeSignal,
                (__userId:number) => {
                    this.m_screenChangeSignal.get (__userId).removeAllListeners ();
                }
            );
        }

	//------------------------------------------------------------------------------------------
        public onPrivateMessage (e:SFS2X.SFSEvent):void {
            console.log (": onPrivateMessage: ", e);

            var __userId:number = e.sender.id;

            switch (e.message) {
                case MessagingManager.READY_SIGNAL:
                    if (this.m_readySignal.has (__userId)) {
                        this.m_readySignal.get (__userId).fireSignal ();
                    }

                    break;

                case MessagingManager.COMPLETE_SIGNAL:
                    if (this.m_completeSignal.has (__userId)) {
                        this.m_completeSignal.get (__userId).fireSignal ();
                    }

                    break;

                case MessagingManager.TRIGGER_SIGNAL:
                    if (this.m_triggerSignal.has (__userId)) {
                        this.m_triggerSignal.get (__userId).fireSignal ();
                    }

                    break;

                case MessagingManager.SCREENCHANGE_SIGNAL:
                    if (this.m_screenChangeSignal.has (__userId)) {
                        this.m_screenChangeSignal.get (__userId).fireSignal ();
                    }
                
                    break;
            }
        }

    //------------------------------------------------------------------------------------------
        public getModeratorID ():number {
            var __userList:Array<SFS2X.SFSUser> = this.m_sfsUserManager.getUserList ();

            var __user:SFS2X.SFSUser;

            for (__user of __userList) {
                if (__user.name.startsWith ("moderator:")) {
                    return __user.id;
                }
            }

            return -1;
        }

    //------------------------------------------------------------------------------------------
        public fireReadySignal (__userId:number):void {
            this.fireSignal (__userId,
                (__userId:number) => {
                    SFSManager.instance ().send (new SFS2X.PrivateMessageRequest (MessagingManager.READY_SIGNAL, __userId));
                }
            );
        }

    //------------------------------------------------------------------------------------------
        public fireCompleteSignal (__userId:number):void {
            this.fireSignal (__userId,
                (__userId:number) => {
                    SFSManager.instance ().send (new SFS2X.PrivateMessageRequest (MessagingManager.COMPLETE_SIGNAL, __userId));
                }
            );
        }

    //------------------------------------------------------------------------------------------
        public fireTriggerSignal (__userId:number, __message:string, __object:SFS2X.SFSObject):void {
            this.fireSignal (__userId,
                (__userId:number) => {
                    SFSManager.instance ().send (new SFS2X.PrivateMessageRequest (MessagingManager.TRIGGER_SIGNAL, __userId));
                }
            );
        }

    //------------------------------------------------------------------------------------------
        public fireScreenChangeSignal (__userId:number, __message:string, __object:SFS2X.SFSObject):void {
            this.fireSignal (__userId,
                (__userId:number) => {
                    SFSManager.instance ().send (new SFS2X.PrivateMessageRequest (MessagingManager.SCREENCHANGE_SIGNAL, __userId));
                }
            );
        }

    //------------------------------------------------------------------------------------------
        public fireSignal (__userId:number, __callback:any):void {
            var __userList:Array<SFS2X.SFSUser> = this.m_sfsUserManager.getUserList ();
            var __user:SFS2X.SFSUser;

            switch (__userId) {
                case MessagingManager.ALL_PLAYERS:
                    for (__user of __userList) {
                        if (!__user.isItMe && !__user.name.startsWith ("moderator:")) {
                            __callback (__user.id);
                        }
                    }

                    break;

                case MessagingManager.ALL_IN_ROOM:
                    for (__user of __userList) {
                        if (!__user.isItMe) {
                            __callback (__user.id);
                        }
                    }

                    break;

                default:
                    __callback (__userId);

                    break;
            }
        }

	//------------------------------------------------------------------------------------------
        public addReadyListener (__userId:number, __listener:any):number {
            if (!this.m_readySignal.has (__userId)) {
                this.m_readySignal.set (__userId, new XSignal ());
            }

            return this.m_readySignal.get (__userId).addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeReadyListener (__userId:number, __id):void {
            if (this.m_readySignal.has (__userId)) {
                return this.m_readySignal.get (__userId).removeListener (__id);
            }
        }

	//------------------------------------------------------------------------------------------
        public addCompleteListener (__userId:number, __listener:any):number {
            if (!this.m_completeSignal.has (__userId)) {
                this.m_completeSignal.set (__userId, new XSignal ());
            }

            return this.m_completeSignal.get (__userId).addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeCompleteListener (__userId:number, __id):void {
            if (this.m_completeSignal.has (__userId)) {
                return this.m_completeSignal.get (__userId).removeListener (__id);
            }
        }
	
	//------------------------------------------------------------------------------------------
        public addTriggerListener (__userId:number, __listener:any):number {
            if (!this.m_triggerSignal.has (__userId)) {
                this.m_triggerSignal.set (__userId, new XSignal ());
            }

            return this.m_triggerSignal.get (__userId).addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeTriggerListener  (__userId:number, __id):void {
            if (this.m_triggerSignal.has (__userId)) {
                return this.m_triggerSignal.get (__userId).removeListener (__id);
            }
        }

	//------------------------------------------------------------------------------------------
        public addScreenChangeListener (__userId:number, __listener:any):number {
            if (!this.m_screenChangeSignal.has (__userId)) {
                this.m_screenChangeSignal.set (__userId, new XSignal ());
            }

            return this.m_screenChangeSignal.get (__userId).addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeScreenChangeListener  (__userId:number, __id):void {
            if (this.m_screenChangeSignal.has (__userId)) {
                return this.m_screenChangeSignal.get (__userId).removeListener (__id);
            }
        }

//------------------------------------------------------------------------------------------
	}
	
//------------------------------------------------------------------------------------------
// }
