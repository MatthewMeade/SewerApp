import "../sass/common.scss";
import flashes from "./modules/flashes";
flashes();

import BulmaCommon from "./BulmaCommon";
import { $$ } from "./modules/Bling";

BulmaCommon();

import attachFileLabels from "./modules/FileUploadLabels";
attachFileLabels();
