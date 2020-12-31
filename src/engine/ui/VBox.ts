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
import { Box } from './Box';
import { XJustify } from './XJustify';

//------------------------------------------------------------------------------------------
export class VBox extends Box {

//------------------------------------------------------------------------------------------
    public reorder ():void {
        super.reorder ();

        switch (this.m_justify) {
            case XJustify.START:
                break;
            case XJustify.END:
                break;
            case XJustify.SPACE_EVENLY:
                break;
            case XJustify.NONE:
                break;
        }
    }

//------------------------------------------------------------------------------------------	
}
	
