//------------------------------------------------------------------------------------------
import * as SFS2X from "sfs2x-api";
import { SFSManager } from '../../engine/sfs/SFSManager';
import { XSignal } from '../../engine/signals/XSignal';

//------------------------------------------------------------------------------------------	
	export class MessagingManager {	
        public static self:MessagingManager;

        public m_readySignal:XSignal;
        public m_completeSignal:XSignal;
        public m_triggerSignal:XSignal;
        public m_screenChangeSignal:XSignal;
        
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
        public setup ():void {
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
