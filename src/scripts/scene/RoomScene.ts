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
import { TextInput } from 'pixi-textinput-v5';
import { HBox } from '../../engine/ui/HBox';
import { VBox } from '../../engine/ui/VBox';
import { XJustify } from '../../engine/ui/XJustify';
import { Spacer } from '../../engine/ui/Spacer';
import { ConnectionManager } from '../sfs/ConnectionManager';
import { XType } from '../../engine/type/XType';
import { G } from '../../engine/app/G';
import { DATState } from './DATState';
import { XMLBox } from '../../engine/ui/XMLBox';

//------------------------------------------------------------------------------------------
export class RoomScene extends DATState {
	public script:XTask;

	public m_xmlBox:XSimpleXMLNode;

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

		var __xmlString:string = __params[0];

		console.log (": xmlString: ", __xmlString);

		var __xmlbox:XMLBox = this.addGameObjectAsChild (XMLBox, 0, 0.0, false) as XMLBox;
		__xmlbox.afterSetup ([
			1500, 1090, XJustify.NONE, 0xc0c0c0,
			"<XMLBox>\n\t<VBox x=\"50%\" y=\"50%\" width=\"1000\" height=\"500\" depth+=\"500\" justify=\"space-between\" fill=\"0xffa0a0\">\n\t\t<TextSpriteButton\n\t\t\tx=\"50%\"\n\t\t\tbuttonClassName=\"StandardButton\"\n\t\t\t9slice=\"true\"\n\t\t\t9width=\"200\"\n\t\t\t9height=\"50\"\n\t\t\ttext=\"hellew\"\n\t\t\tfontName=\"Nunito\"\n\t\t\tfontSize=\"30\"\n\t\t\tcolorNormal=\"0x000000\"\n\t\t\tcolorOver=\"0x00ff00\"\n\t\t\tcolorDown=\"0x0000ff\"\n\t\t\tcolorSelected=\"0xff0000\"\n\t\t\tcolorDisabled=\"0xc0c0c0\"\n\t\t\tbold=\"true\"\n\t\t\thorizontAlignment=\"center\"\n\t\t\tverticalAlignment=\"center\"\n\t\t/>\n\t\t<TextButton\n\t\t\tx=\"50%\"\n\t\t\twidth=\"200\"\n\t\t\theight=\"50\"\n\t\t\ttext=\"hellew\"\n\t\t\tfontName=\"Nunito\"\n\t\t\tfontSize=\"30\"\n\t\t\tcolorNormal=\"0x000000\"\n\t\t\tcolorOver=\"0x00ff00\"\n\t\t\tcolorDown=\"0x0000ff\"\n\t\t\tcolorSelected=\"0xff0000\"\n\t\t\tcolorDisabled=\"0xc0c0c0\"\n\t\t\tbold=\"true\"\n\t\t\thorizontAlignment=\"center\"\n\t\t\tverticalAlignment=\"center\"\n\t\t/>\n\t\t<SpriteButton\n\t\t\tx=\"50%\"\n\t\t\tbuttonClassName=\"TestButton\"\n\t\t\t9slice=\"true\"\n\t\t\t9width=\"200\"\n\t\t\t9height=\"50\"\n\t\t/>\n\t</VBox>\n\t<AnimatedSprite\n\t\tx=\"25%\" y=\"25%\"\n\t\tclassName=\"TestImage\"\n\t/>\n</XMLBox>\n"

		]);

		this.horizontalPercent (__xmlbox, 0.50);
		this.verticalPercent (__xmlbox, 0.50);

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
    }
    
//------------------------------------------------------------------------------------------
}