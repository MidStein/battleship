import './style.css';
import Player from './player';
import Dom from './dom';

const user = Player();
const computer = Player();
Dom.initialize(user, computer);
