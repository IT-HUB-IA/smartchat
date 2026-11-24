import React,{useEffect,useRef} from 'react';
import template from './auth-template.html';
import css from './auth-screen.css.txt';
import {mountAuthScreen} from './auth-screen.js';

export function AuthScreen({auth,onDone}){
  const container=useRef(null),callback=useRef(onDone);
  callback.current=onDone;
  useEffect(()=>mountAuthScreen(container.current,{auth,onDone:()=>callback.current()}),[auth]);
  return <><style>{css}</style><div ref={container} dangerouslySetInnerHTML={{__html:template}}/></>;
}
