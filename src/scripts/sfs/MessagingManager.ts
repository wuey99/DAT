//------------------------------------------------------------------------------------------
import * as SFS2X from "sfs2x-api";
import { SFSManager } from '../../engine/sfs/SFSManager';
import { XSignal } from '../../engine/signals/XSignal';

//------------------------------------------------------------------------------------------	
	export class MessagingManager {	
        public static self:MessagingManager;

        public m_sfsRoom:SFS2X.SFSRoom;
        public m_sfsRoomManager:SFS2X.SFSRoomManager;

        public m_sfsUser:SFS2X.SFSUser;
        public m_sfsUserManager:SFS2X.SFSUserManager;
    
        public m_readySignal:XSignal;
        public m_completeSignal:XSignal;
        public m_triggerSignal:XSignal;
        public m_screenChangeSignal:XSignal;
        
        public static READY_SIGNAL:string = "ready";
        public static COMPLETE_SIGNAL:string = "complete";
        public static TRIGGER_SIGNAL:string = "trigger";
        public static SCREENCHANGE_SIGNAL:string = "screen-change";

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

            this.m_readySignal = new XSignal ();
            this.m_completeSignal = new XSignal ();
            this.m_triggerSignal = new XSignal ();
            this.m_screenChangeSignal = new XSignal ();

            SFSManager.instance ().addEventListener (SFS2X.SFSEvent.PRIVATE_MESSAGE, this.onPrivateMessage.bind (this));
        }

    //------------------------------------------------------------------------------------------
        public cleanup ():void {
            this.m_readySignal.removeAllListeners ();
            this.m_completeSignal.removeAllListeners ();
            this.m_triggerSignal.removeAllListeners ();
            this.m_screenChangeSignal.removeAllListeners ();
        }

	//------------------------------------------------------------------------------------------
        public onPrivateMessage (e:SFS2X.SFSEvent):void {
            console.log (": onPrivateMessage: ", e);
        }

    //------------------------------------------------------------------------------------------
        public fireReadySignal ():void {
        }

    //------------------------------------------------------------------------------------------
        public fireCompleteSignal ():void {
        }

    //------------------------------------------------------------------------------------------
        public fireTriggerSignal ():void {
        }

    //------------------------------------------------------------------------------------------
        public fireScreenChangeSignal (__id:number):void {
            SFSManager.instance ().send (new SFS2X.PrivateMessageRequest (MessagingManager.SCREENCHANGE_SIGNAL, __id));
        }

	//------------------------------------------------------------------------------------------
        public addReadyListener (__listener:any):number {
            return this.m_readySignal.addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeReadyListener (__id):void {
            return this.m_readySignal.removeListener (__id);
        }

	//------------------------------------------------------------------------------------------
        public addCompleteListener (__listener:any):number {
            return this.m_completeSignal.addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeCompleteListener (__id):void {
            return this.m_completeSignal.removeListener (__id);
        }
	
	//------------------------------------------------------------------------------------------
        public addTriggerListener (__listener:any):number {
            return this.m_triggerSignal.addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeTriggerListener  (__id):void {
            return this.m_triggerSignal.removeListener (__id);
        }

	//------------------------------------------------------------------------------------------
        public addScreenChangeListener (__listener:any):number {
            return this.m_screenChangeSignal.addListener (__listener);
        }

	//------------------------------------------------------------------------------------------
        public removeScreenChangeListener  (__id):void {
            return this.m_screenChangeSignal.removeListener (__id);
        }

//------------------------------------------------------------------------------------------
	}
	
//------------------------------------------------------------------------------------------
// }
