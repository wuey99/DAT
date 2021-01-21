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
import { XTextGameObject } from '../../engine/ui/XTextGameObject';
import { XTextSprite } from '../../engine/sprite/XTextSprite';
import { TextInput } from 'pixi-textinput-v5';
import { HBox } from '../../engine/ui/HBox';
import { VBox } from '../../engine/ui/VBox';
import { XJustify } from '../../engine/ui/XJustify';
import { Spacer } from '../../engine/ui/Spacer';
import { ConnectionManager } from '../sfs/ConnectionManager';
import { XType } from '../../engine/type/XType';
import { G } from '../../engine/app/G';
import { DATState } from '../scene/DATState';
import { XMLBox } from '../../engine/ui/XMLBox';
import { MessagingManager } from '../sfs/MessagingManager';
import { Resource } from '../../engine/resource/Resource';

//------------------------------------------------------------------------------------------
export class AudioTest extends DATState {
	public script:XTask;

	public m_currentAudio:string;
	public m_statusMessage:XTextGameObject;

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

		this.m_currentAudio = "";

		this.setupUI ();

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
    }
	
//------------------------------------------------------------------------------------------
	public setupUI ():void {
		this.createStatusMessage ();

		var __userList:Array<SFS2X.SFSUser> = ConnectionManager.instance ().getSFSUserManager ().getUserList ();

		var __mainLayout:VBox = this.addGameObjectAsChild (VBox, 0, 0.0, false) as VBox;
		__mainLayout.afterSetup ([1500, 1000, XJustify.CENTER, 0x40e0e0]);
		__mainLayout.spacing = 32;
		
		var __userListLayout:VBox = __mainLayout.addGameObjectAsChild (VBox, 0, 0.0, false) as VBox;
		__userListLayout.afterSetup ([1000, 400, XJustify.START, 0xa0a0a0]);
		__userListLayout.spacing = 16;
		
		var __user:SFS2X.SFSUser;

		for (__user of __userList) {
			console.log (": userName: ", __user);

			var __playerButton:XTextSpriteButton = __userListLayout.addGameObjectAsChild (XTextSpriteButton, 0, 0.0, false) as XTextSpriteButton;
			__playerButton.afterSetup ([
				"StandardButton",
				true, 10, 750, 60,
				__user.name,
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
			__userListLayout.addItem (__playerButton);
			__userListLayout.horizontalPercent (__playerButton, 0.50);

			var __callback = (__user:SFS2X.SFSUser) => {
				__playerButton.addMouseUpEventListener (() => {
					if (this.m_currentAudio != "") {
						console.log (": userId: ", __user.id, __user.name);

						MessagingManager.instance ().fireTriggerSignal (
							__user.id, "PLAY-SOUND",
							{
								name: this.m_currentAudio
							}
						);
					}
				});
			};

			__callback (__user);
		}
		__mainLayout.addItem (__userListLayout);
		__mainLayout.horizontalPercent (__userListLayout, 0.50);

		var __spacer:Spacer = __mainLayout.addGameObjectAsChild (Spacer, 0, 0.0, false) as Spacer;
		__spacer.afterSetup ([750, 32]);
		__mainLayout.addItem (__spacer);

		var __audioListLayout:VBox = __mainLayout.addGameObjectAsChild (VBox, 0, 0.0, false) as VBox;
		__audioListLayout.afterSetup ([1000, 400, XJustify.START, 0xa0a0a0]);
		__mainLayout.addItem (__audioListLayout);
		__mainLayout.horizontalPercent (__audioListLayout, 0.50);

		var __resourceMap:Map<string, Resource> = this.m_XApp.getXProjectManager ().getResourceManagerByName ("TestAudio").getResourceMap ();

		XType.forEach (__resourceMap,
			(__name:string) => {
				var __textButton:XTextButton = __audioListLayout.addGameObjectAsChild (XTextButton, 0, 0.0, false) as XTextButton;
				__textButton.afterSetup ([
					750,
					25,
					__name,
					"Nunito",
					25,
					0x0000ff,
					0xff0000,
					0x00ff00,
					0x0000ff,
					0x0000ff,
					false,
					"center", "center"
				]);
				__audioListLayout.addItem (__textButton);

				__audioListLayout.horizontalPercent (__textButton, 0.50);

				__textButton.addMouseUpListener (() => {
					this.m_currentAudio = __name;

					this.m_statusMessage.text = "Current Audio: " + __name;

					this.horizontalPercent (this.m_statusMessage, 0.50);
				});
			}
		);

		this.horizontalPercent (__mainLayout, 0.50);
		this.verticalPercent (__mainLayout, 0.50);
	}
	
//------------------------------------------------------------------------------------------
	public createStatusMessage ():void {
		this.m_statusMessage = this.addGameObjectAsChild (XTextGameObject, 0, 0.0) as XTextGameObject;
		this.m_statusMessage.afterSetup ([]);

		this.m_statusMessage.setupText (
			-1,
			30,
			"",
			"Nunito",
			30,
			0x000000,
			true,
			"center", "center"
		);

		this.horizontalPercent (this.m_statusMessage, 0.50);
		this.verticalPercent (this.m_statusMessage, 0.0);
	}

//------------------------------------------------------------------------------------------
}