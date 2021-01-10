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
				this.removeReadyListener (__id);
			}

			for (__id of this.m_completeSignals.keys ()) {
				this.removeCompleteListener (__id);
			}

			for (__id of this.m_triggerSignals.keys ()) {
				this.removeTriggerListener (__id);
			}

			for (__id of this.m_screenChangeSignals.keys ()) {
				this.removeScreenChangeListener (__id);
			}
		}		

//------------------------------------------------------------------------------------------
		public addReadyListener (__listener:any):number {
			var __id:number = MessagingManager.instance ().addReadyListener (__listener);

			this.m_readySignals.set (__id, 0);
		
			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeReadyListener (__id):void {
			if (this.m_readySignals.has (__id)) {
				MessagingManager.instance ().removeReadyListener (__id);

				this.m_readySignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
		public addCompleteListener (__listener:any):number {
			var __id:number = MessagingManager.instance ().addCompleteListener (__listener);

			this.m_completeSignals.set (__id, 0);

			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeCompleteListener (__id):void {
			if (this.m_completeSignals.has (__id)) {
				MessagingManager.instance ().removeCompleteListener (__id);

				this.m_completeSignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
		public addTriggerListener (__listener:any):number {
			var __id:number = MessagingManager.instance ().addTriggerListener (__listener);

			this.m_triggerSignals.set (__id, 0);

			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeTriggerListener  (__id):void {
			if (this.m_triggerSignals.has (__id)) {
				MessagingManager.instance ().removeTriggerListener (__id);

				this.m_triggerSignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
		public addScreenChangeListener (__listener:any):number {
			var __id:number = MessagingManager.instance ().addScreenChangeListener (__listener);

			this.m_screenChangeSignals.set (__id, 0);

			return __id;
		}

//------------------------------------------------------------------------------------------
		public removeScreenChangeListener  (__id):void {
			if (this.m_screenChangeSignals.has (__id)) {
				MessagingManager.instance ().removeScreenChangeListener (__id);

				this.m_screenChangeSignals.delete (__id);
			}
		}

//------------------------------------------------------------------------------------------
	}
	
//------------------------------------------------------------------------------------------
// }
