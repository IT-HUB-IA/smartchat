import React,{useState} from 'react';
import {createAuthClient} from 'better-auth/react';
import {Field,Button} from './ui.jsx';
const auth=createAuthClient();
export function Recovery({onClose}){
 const token=new URLSearchParams(location.search).get('token');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function submit(e){e.preventDefault();setError('');setBusy(true);const f=new FormData(e.currentTarget);try{const result=token?await auth.resetPassword({token,newPassword:f.get('password')}):await auth.requestPasswordReset({email:f.get('email'),redirectTo:location.origin+'/reset-password'});if(result.error)throw Error(result.error.message);setMessage(token?'Senha atualizada. Entre novamente com sua nova senha.':'Se houver uma conta com esse e-mail, você receberá um link para redefinir a senha.');}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <main className="onboarding"><img className="logo" src={'/assets/brand/v3/smartchat-logo'+(document.documentElement.dataset.tema==='escuro'?'-light':'')+'.svg'} alt="SmartChat"/><section className="card"><span className="eyebrow">Acesso à sua conta</span><h1>{token?'Um novo começo.':'Vamos recuperar seu acesso.'}</h1><p>{token?'Escolha uma nova senha com pelo menos 10 caracteres.':'Informe seu e-mail para solicitar o link de recuperação.'}</p>{message?<div className="notice" role="status">{message}</div>:<form onSubmit={submit}><Field label={token?'Nova senha':'E-mail'} name={token?'password':'email'} type={token?'password':'email'} autoComplete={token?'new-password':'email'} minLength={token?10:undefined} required maxLength={token?128:200}/>{error&&<p className="error" role="alert">{error}</p>}<Button busy={busy} icon="mail">{busy?'Aguarde…':token?'Salvar nova senha':'Enviar link de recuperação'}</Button></form>}<button className="lnk" onClick={()=>{history.replaceState({},'','/app');onClose();}}>Voltar para entrar</button></section></main>;
}
