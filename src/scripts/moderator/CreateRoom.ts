//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy'
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
import { XGameObject} from '../../engine/gameobject/XGameObject';
import { XState } from '../../engine/state/XState';
import { GUID } from '../../engine/utils/GUID';
import { XSimpleXMLNode } from '../../engine/xml/XSimpleXMLNode';
import * as SFS2X from "sfs2x-api";
import { SFSManager } from '../../engine/sfs/SFSManager';
import { XSpriteButton } from '../../engine/ui/XSpriteButton';
import { XTextButton } from '../../engine/ui/XTextButton';
import { XTextSpriteButton } from '../../engine/ui/XTextSpriteButton';
import { XTextSprite } from '../../engine/sprite/XTextSprite';
import { XTextGameObject } from '../../engine/ui/XTextGameObject';
import { TextInput } from 'pixi-textinput-v5';
import { ConnectionManager } from '../sfs/ConnectionManager';
import { XType } from '../../engine/type/XType';
import { G } from '../../engine/app/G';
import { DATState } from '../scene/DATState';
import { HBox } from '../../engine/ui/HBox';
import { VBox } from '../../engine/ui/VBox';
import { XJustify } from '../../engine/ui/XJustify';
import { Spacer } from '../../engine/ui/Spacer';
import { FlockLeader } from '../test/FlockLeader';
import { MessagingManager } from '../sfs/MessagingManager';

//------------------------------------------------------------------------------------------
export class CreateRoom extends DATState {
	public m_statusMessage:XTextGameObject;
	public m_createRoomButton:XTextSpriteButton;
	public script:XTask;
	public m_createRoomLayout:HBox;
	public m_waitJoinLayout:HBox;
	public m_joinedUsersLayout:VBox;

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
	
		this.script = this.addEmptyTask ();

		this.createStatusMessage ();

		this.setupCreateRoomUI ();

		this.Idle_Script ();

		SFSManager.instance ().addEventListener (SFS2X.SFSEvent.USER_ENTER_ROOM, (e:SFS2X.SFSEvent) => {
			console.log (": userEnteredRoom: ", e);
		});

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
        super.cleanup ();
	}
	
//------------------------------------------------------------------------------------------
	public createStatusMessage ():void {
		this.m_statusMessage = this.addGameObjectAsChild (XTextGameObject, 0, 0.0) as XTextGameObject;
		this.m_statusMessage.afterSetup ([]);

		this.m_statusMessage.setupText (
			-1,
			64,
			"",
			"Nunito",
			75,
			0x0000ff,
			true,
			"center", "center"
		);

		this.horizontalPercent (this.m_statusMessage, 0.50);
		this.verticalPercent (this.m_statusMessage, 0.125);
	}

	//------------------------------------------------------------------------------------------
	public setStatusMessage (__text:string):void {
		this.m_statusMessage.text = __text;

		this.horizontalPercent (this.m_statusMessage, 0.50);
	}

//------------------------------------------------------------------------------------------
	public showRoomID (__roomID:string):void {
		this.setStatusMessage ("Room ID: ");

		var __hbox:HBox = this.addGameObjectAsChild (HBox, 0, 0.0, false) as HBox;
		__hbox.afterSetup ([400, 100, XJustify.CENTER]);

		var __roomIDText:any = new TextInput (
			{
				input: {
					fontSize: '40px'
				}, 
				box: {fill: 0xc0c0c0},
			}
		);

		__roomIDText.text = __roomID;

		__hbox.addItem (__roomIDText);
		__hbox.addSortableChild (__roomIDText, 0, 0.0, false);

		this.horizontalPercent (__hbox, 0.50);
		this.verticalPercent (__hbox, 0.25);
	}

//------------------------------------------------------------------------------------------
	public setupCreateRoomUI ():void {
		this.setStatusMessage ("Create Room");

		var __ypercent:number = 0.50;

		var __hbox:HBox = this.m_createRoomLayout = this.addGameObjectAsChild (HBox, 0, 0.0, false) as HBox;
		__hbox.afterSetup ([400, 100, XJustify.SPACE_BETWEEN]);

		var __vbox:VBox = __hbox.addGameObjectAsChild (VBox, 0, 0.0, false) as VBox;
		__vbox.afterSetup ([250, 60, XJustify.CENTER]);

		var __roomLabel:XTextSprite = this.createXTextSprite (
			-1,
			-1,
			"Create a new Room",
			"Nunito",
			25,
			0x000000,
			true,
			"center", "center"
		);

		__vbox.addItem (__roomLabel);
		__vbox.addSortableChild (__roomLabel, 0, 0.0, false);
		
		__hbox.addItem (__vbox);
		__hbox.addSortableChild (__vbox, 0, 0.0, false);

		var __createButton:XTextSpriteButton = this.m_createRoomButton = __hbox.addGameObjectAsChild (XTextSpriteButton, 0, 0.0, false) as XTextSpriteButton;
		__createButton.afterSetup ([
			"StandardButton",
			true, 10, 150, 60,
			"CREATE",
			"Nunito",
			25,
			0x000000,
			0x000000,
			0x000000,
			0x000000,
			0x000000,
			false,
			"center", "center"
		]);
		__hbox.addItem (__createButton);

		this.horizontalPercent (__hbox, 0.50);
		this.verticalPercent (__hbox, __ypercent);

		this.m_createRoomButton.addMouseUpListener (() => {
			console.log (": mouse up: ");

			this.m_createRoomButton.setDisabled (true);

			this.createRoom ();
		});
	}

	//------------------------------------------------------------------------------------------
	public Idle_Script ():void {
		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.WAIT1000, 1 * 1000,

					XTask.LABEL, "loop",
						XTask.WAIT, 0x0100,

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
	public createRoom ():void {
		var __roomID:string = GUID.create ().substring (1, 18);

		var __settings:SFS2X.RoomSettings = new SFS2X.RoomSettings (__roomID);
		__settings.maxUsers = 6;
		__settings.groupId = "default";

		SFSManager.instance ().once (SFS2X.SFSEvent.ROOM_ADD, (e:SFS2X.SFSEvent) => {
			console.log (": onRoomAdded: ", e);

			this.m_createRoomLayout.nukeLater ();

			this.showRoomID (__roomID);

			ConnectionManager.instance ().JoinRoom_Script (__roomID);

			this.WaitForAllToJoin_Script ();
		});

		SFSManager.instance ().once (SFS2X.SFSEvent.ROOM_CREATION_ERROR, (e:SFS2X.SFSEvent) => {
			console.log (": onRoomCreationError: ", e);
		});

		SFSManager.instance ().send (new SFS2X.CreateRoomRequest (__settings));
	}

	//------------------------------------------------------------------------------------------
	public setupWaitForAllToJoinUI ():void {
		var __waitJoinLayout:VBox = this.m_waitJoinLayout = this.addGameObjectAsChild (VBox, 0, 0.0, false) as VBox;
		__waitJoinLayout.afterSetup ([1000, 300, XJustify.CENTER]);

		this.horizontalPercent (__waitJoinLayout, 0.50);
		this.verticalPercent (__waitJoinLayout, 0.50);

		var __titleLabel:XTextSprite = this.createXTextSprite (
			-1,
			-1,
			"Joined Users:",
			"Nunito",
			50,
			0x000000,
			true,
			"center", "center"
		);

		__waitJoinLayout.addItem (__titleLabel);
		__waitJoinLayout.addSortableChild (__titleLabel, 0, 0.0, false);

		__waitJoinLayout.horizontalPercent (__titleLabel, 0.50);

		var __spacer:Spacer = __waitJoinLayout.addGameObjectAsChild (Spacer, 0, 0.0, false) as Spacer;
		__spacer.afterSetup ([100, 50]);
		__waitJoinLayout.addItem (__spacer);

		var __joinedUsers:VBox = this.m_joinedUsersLayout = __waitJoinLayout.addGameObjectAsChild (VBox, 0, 0.0, false) as VBox;
		__joinedUsers.afterSetup ([1000, 200, XJustify.START]);

		__waitJoinLayout.addItem (__joinedUsers);

		__waitJoinLayout.horizontalPercent (__joinedUsers, 0.50);
	}

	//------------------------------------------------------------------------------------------
	public collectUsers (__userMap:Map<SFS2X.SFSUser, number>, __userList:Array<SFS2X.SFSUser>):void {
		var __user:SFS2X.FSUser;

		for (__user of __userList) {
			__userMap.set (__user, 0);
		}
	}

	//------------------------------------------------------------------------------------------
	public showJoinedUsers (__userMap:Map<SFS2X.SFSUser, number>):void {
		this.m_joinedUsersLayout.removeAllItems ();
		
		XType.forEach (__userMap,
			(__user:SFS2X.SFSUser) => {
				var __userLabel:XTextSprite = this.createXTextSprite (
					-1,
					-1,
					__user.name,
					"Nunito",
					25,
					0x000000,
					true,
					"center", "center"
				);

				this.m_joinedUsersLayout.addItem (__userLabel);
				this.m_joinedUsersLayout.addSortableChild (__userLabel, 0, 0.0, false);
				this.m_joinedUsersLayout.horizontalPercent (__userLabel, 0.50);
			}
		);
	}

	//------------------------------------------------------------------------------------------
	public WaitForAllToJoin_Script ():void {
		var __userList:Array<SFS2X.SFSUser>;
		var __userMap:Map<SFS2X.SFSUser, number> = new Map<SFS2X.SFSUser, number> ();

		this.setupWaitForAllToJoinUI ();

		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.LABEL, "loop",
						XTask.WAIT1000, 1 * 1000,

						XTask.FLAGS, (__task:XTask) => {
							__userList = ConnectionManager.instance ().getSFSUserManager ().getUserList ();

							console.log (": users: ", __userMap, __userMap.size);

							this.collectUsers (__userMap, __userList);

							this.showJoinedUsers (__userMap);

							__task.ifTrue (__userMap.size == 3);
						}, XTask.BNE, "loop",

						() => {
							this.WaitToStart_Script ();
						},

						XTask.GOTO, "loop",

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
	public WaitToStart_Script ():void {
		var __startButton:XTextSpriteButton = this.m_waitJoinLayout.addGameObjectAsChild (XTextSpriteButton, 0, 0.0, false) as XTextSpriteButton;
		__startButton.afterSetup ([
			"StandardButton",
			true, 10, 300, 60,
			"START GAME",
			"Nunito",
			25,
			0x000000,
			0x000000,
			0x000000,
			0x000000,
			0x000000,
			false,
			"center", "center"
		]);

		this.m_waitJoinLayout.addItem (__startButton);
		this.m_waitJoinLayout.horizontalPercent (__startButton, 0.50);

		__startButton.addMouseUpListener (() => {
			__startButton.setDisabled (true);

			MessagingManager.instance ().fireScreenChangeSignal (MessagingManager.ALL_PLAYERS, "hellew", null);
		})

		//------------------------------------------------------------------------------------------
		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.LABEL, "loop",
						XTask.WAIT, 0x0100,

						XTask.GOTO, "loop",

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