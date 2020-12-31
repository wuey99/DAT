//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy';
import { XSprite } from '../sprite/XSprite';
import { XWorld } from '../sprite/XWorld';
import { XGameObject} from '../gameobject/XGameObject';
import { XTask } from "../task/XTask";
import { XSignal } from '../signals/XSignal';
import { XApp } from '../app/XApp';
import { XType } from '../type/XType';
import { TextInput } from 'pixi-textinput-v5';

//------------------------------------------------------------------------------------------
export class Box extends XGameObject {
    public m_width:number;
    public m_height:number;
    public m_justify:string;
    public m_items:Array<PIXI.Sprite | TextInput>;
    public m_spacing:number;
    public m_padding:number;
    public m_topPadding:number;
    public m_bottomPadding:number;
    public m_leftPadding:number;
    public m_rightPadding:number;

//------------------------------------------------------------------------------------------
	public constructor () {
		super ();
	}

//------------------------------------------------------------------------------------------
    public setup (__world:XWorld, __layer:number, __depth:number):XGameObject {
        super.setup (__world, __layer, __depth);

        this.m_items = new Array<PIXI.Sprite | TextInput> ();
        
        return this;
    }

//------------------------------------------------------------------------------------------
    public afterSetup (__params:Array<any> = null):XGameObject {
        super.afterSetup (__params);	

        this.m_width = __params[this.m_paramIndex++];
        this.m_height = __params[this.m_paramIndex++];
        this.m_justify = __params[this.m_paramIndex++];

        this.m_spacing = 0;
        this.m_padding = 0;
        this.m_leftPadding = 0;
        this.m_rightPadding = 0;
        this.m_topPadding = 0;
        this.m_bottomPadding = 0;

        return this;
    }

//------------------------------------------------------------------------------------------
    public cleanup ():void {
        super.cleanup ();
    }

//------------------------------------------------------------------------------------------
    public addItem (__item:PIXI.Sprite | TextInput, __layer:number = -1, __depth:number = -1, __visible:boolean = false):void {
        this.m_items.push (__item);

        if (__layer < 0) __layer = this.getLayer ();
        if (__depth < 0) __depth = this.getDepth ();

        this.addSortableChild (__item, __layer, __depth, __visible);
    }

//------------------------------------------------------------------------------------------
    public reorder ():void {
    }

//------------------------------------------------------------------------------------------
    public getActualWidth ():number {
        return this.m_width - this.m_leftPadding - this.m_rightPadding;
    }

//------------------------------------------------------------------------------------------
    public getActualHeight ():number {
        return this.m_height - this.m_topPadding - this.m_bottomPadding;
    }

//------------------------------------------------------------------------------------------	
}
	
