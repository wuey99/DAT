//------------------------------------------------------------------------------------------
import { MessagingManager } from './MessagingManager';

//------------------------------------------------------------------------------------------	
	export class MessagingSubManager {	
		public m_readySignals:Map<number, number>;
		public m_completeSignals:Map<number, number>;
		public m_triggerSignals:Map<number, number>;
		public m_screenChangeSignals:Map<number, number>;
		
//------------------------------------------------------------------------------------------
		constructor () {		
			this.m_readySignals = new Map<number, number> ();
			this.m_completeSignals = new Map<number, number> ();
			this.m_triggerSignals = new Map<number, number> ();
			this.m_screenChangeSignals = new Map<number, number> ();
		}

//------------------------------------------------------------------------------------------
		public setup ():void {
		}

//------------------------------------------------------------------------------------------
		public cleanup ():void {
			this.removeAllListeners ();
		}

//------------------------------------------------------------------------------------------
		public removeAllListeners ():void {
            var __id:number;

			for (__id of this.m_readySignals.keys ()) {
				this.removeReadyListener (this.m_readySignals.get (__id), __id);
			}

			for (__id of this.m_completeSignals.keys ()) {
				this.removeCompleteListener (this.m_completeSignals.get (__id), __id);
			}

			for (__id of this.m_triggerSignals.keys ()) {
				this.removeTriggerListener (this.m_triggerSignals.get (__id), __id);
			}

			for (__id of this.m_screenChangeSignals.keys ()) {
				this.removeScreenChangeListener (this.m_screenChangeSignals.get (__id), __id);
			}
		}		

//------------------------------------------------------------------------------------------
		public addReadyListener (__userId:number, __listener:any):number {
			var __id:number = MessagingManager.instance ().addReadyListener (__userId, __listener);

			this.m_readySignals.set (__id, __userId);
		
			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeReadyListener (__userId:number, __id):void {
			if (this.m_readySignals.has (__id)) {
				MessagingManager.instance ().removeReadyListener (__userId, __id);

				this.m_readySignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
		public addCompleteListener (__userId:number, __listener:any):number {
			var __id:number = MessagingManager.instance ().addCompleteListener (__userId, __listener);

			this.m_completeSignals.set (__id, __userId);

			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeCompleteListener (__userId:number, __id):void {
			if (this.m_completeSignals.has (__id)) {
				MessagingManager.instance ().removeCompleteListener (__userId, __id);

				this.m_completeSignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
		public addTriggerListener (__userId:number, __listener:any):number {
			var __id:number = MessagingManager.instance ().addTriggerListener (__userId, __listener);

			this.m_triggerSignals.set (__id, __userId);

			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeTriggerListener  (__userId:number, __id):void {
			if (this.m_triggerSignals.has (__id)) {
				MessagingManager.instance ().removeTriggerListener (__userId, __id);

				this.m_triggerSignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
		public addScreenChangeListener (__userId:number, __listener:any):number {
			var __id:number = MessagingManager.instance ().addScreenChangeListener (__userId, __listener);

			this.m_screenChangeSignals.set (__id, __userId);

			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeScreenChangeListener  (__userId:number, __id):void {
			if (this.m_screenChangeSignals.has (__id)) {
				MessagingManager.instance ().removeScreenChangeListener (__userId, __id);

				this.m_screenChangeSignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
	}
	
//------------------------------------------------------------------------------------------
// }
