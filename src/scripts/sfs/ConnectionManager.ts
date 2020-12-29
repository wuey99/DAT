//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy'
import * as SFS2X from "sfs2x-api";
import { SFSManager } from '../../engine/sfs/SFSManager';
import { XApp } from '../../engine/app/XApp';
import { XSprite } from '../../engine/sprite/XSprite';
import { XSpriteLayer } from '../../engine/sprite/XSpriteLayer';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { world } from '../app';
import { XTask } from '../../engine/task/XTask';
import { XTaskManager} from '../../engine/task/XTaskManager';
import { XTaskSubManager} from '../../engine/task/XTaskSubManager';
import { XWorld} from '../../engine/sprite/XWorld';
import { XType } from '../../engine/type/XType';
import { XGameObject} from '../../engine/gameobject/XGameObject';

//------------------------------------------------------------------------------------------
export class ConnectionManager extends XGameObject {
    public script:XTask;

    public m_connected:boolean;
	public m_loggedinToZone:boolean;
	
	public m_connectedSignal:XSignal;
    public m_disconnectedSignal:XSignal;
	public m_loggedInToZone:XSignal;
	public m_loggedOutOfZone:XSignal;
	
//------------------------------------------------------------------------------------------	
	constructor () {
		super ();
	}
	
//------------------------------------------------------------------------------------------
	public setup (__world:XWorld, __layer:number, __depth:number):XGameObject {
        super.setup (__world, __layer, __depth);

		return this;
	}
	
//------------------------------------------------------------------------------------------
	public afterSetup (__params:Array<any> = null):XGameObject {
        super.afterSetup (__params);

		this.m_connectedSignal = new XSignal ();
		this.m_disconnectedSignal = new XSignal ();
		this.m_loggedInToZone = new XSignal ();
		this.m_loggedOutOfZone = new XSignal ();

        this.script = this.addEmptyTask ();

        this.m_connected = false;
        this.m_loggedinToZone = false;

        console.log (": xyzzy: ");
        
        this.Connect_Script ();

		return this;
	}
	
//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
		
		this.m_connectedSignal.removeAllListeners ();
		this.m_disconnectedSignal.removeAllListeners ();
		this.m_loggedInToZone.removeAllListeners ();
        this.m_loggedOutOfZone.removeAllListeners ();
	}

	//------------------------------------------------------------------------------------------
	public addConnectedistener (__listener:any):number {
		return this.m_connectedSignal.addListener (__listener);
	}

	//------------------------------------------------------------------------------------------
	public addDisconnectedistener (__listener:any):number {
		return this.m_disconnectedSignal.addListener (__listener);
	}

	//------------------------------------------------------------------------------------------
	public addLoggedIntoZoneistener (__listener:any):number {
		return this.m_loggedInToZone.addListener (__listener);
	}

	//------------------------------------------------------------------------------------------
	public addLoggedOutOfZoneistener (__listener:any):number {
		return this.m_loggedOutOfZone.addListener (__listener);
	}

	//------------------------------------------------------------------------------------------
	public Connect_Script ():void {
		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					() => {
						SFSManager.instance ().setup ();
                        
						SFSManager.instance ().connect (
							"127.0.0.1", 8080,
							(e:SFS2X.SFSEvent) => {
								console.log (": ----------------->: connected: ");
				
								this.m_connected = true;
							},
							(e:SFS2X.SFSEvent) => {
								console.log (": ----------------->: disconnected: ");
				
								this.m_connected = false;
							}
						);
					},

                    XTask.LABEL, "loop",
						XTask.WAIT, 0x0100,
                        
                        XTask.FLAGS, (__task:XTask) => {
                            __task.ifTrue (
                                SFSManager.instance ().isConnected ()
                            );
                        }, XTask.BNE, "loop",

						() => {
                            this.LoginToZone_Script ();
                        },
						
					XTask.RETN,
				]);	
			},
				
			//------------------------------------------------------------------------------------------
			// animation
			//------------------------------------------------------------------------------------------	
			XTask.LABEL, "loop",
                XTask.WAIT, 0x0100,
					
				XTask.GOTO, "loop",
				
			XTask.RETN,
				
			//------------------------------------------------------------------------------------------			
		]);
			
	//------------------------------------------------------------------------------------------
    }
       
	//------------------------------------------------------------------------------------------
	public LoginToZone_Script ():void {

		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.LABEL, "loop",
						XTask.WAIT, 0x0100,
                        
                        () => {
                            console.log (": connected: ");
        
                            SFSManager.instance ().send (new SFS2X.LoginRequest("FozzieTheBear", "", null, "BasicExamples"));
                            SFSManager.instance ().once (SFS2X.SFSEvent.LOGIN, (e:SFS2X.SFSEvent) => {
								console.log (": logged in: ", e);
								
								this.m_loggedinToZone = true;
                            });
                            SFSManager.instance ().once (SFS2X.LOGIN_ERROR, (e:SFS2X.SFSEvent) => {
                                console.log (": login error: ", e);
							});
                            SFSManager.instance ().once (SFS2X.SFSEvent.LOGOUT, (e:SFS2X.SFSEvent) => {
								console.log (": logged out: ", e);
								
								this.m_loggedinToZone = false;
                            });
                        },
        
					XTask.RETN,
				]);	
			},
				
			//------------------------------------------------------------------------------------------
			// animation
			//------------------------------------------------------------------------------------------	
			XTask.LABEL, "loop",
                XTask.WAIT, 0x0100,
					
				XTask.GOTO, "loop",
				
			XTask.RETN,
				
			//------------------------------------------------------------------------------------------			
		]);
			
	//------------------------------------------------------------------------------------------
    }

//------------------------------------------------------------------------------------------
}