const sgMail = require('@sendgrid/mail');

// const sendgridAPIKey='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'
 sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//welcome mail to user
 const welcomeMsgToUser=(mail,name)=>{
     sgMail.send({
         to:mail,
         from:'pravallika.sanaboyina@credencys.com',
         subject:'Thanks for joining in!',
         text:`Welcome to task app. ${name} .`
     })
 }
//mail to user after cancellation 
const cancelMsgToUser=(mail,name)=>{
    sgMail.send({
        to:mail,
        from:'pravallika.sanaboyina@credencys.com',
        subject:'sorry to see you go!',
        text:`hello..${name}, can i know What is the reason behind your cancellation`
    })
}
module.exports={
    welcomeMsgToUser,
    cancelMsgToUser
}
// const msg = {
//     to: 'pravallikasanaboyina@gmail.com',
//     from: 'pravallika.sanaboyina@credencys.com',
//     subject: 'Sending by pravallika',
//     text: 'hi...valli'
    
//   };
//   sgMail.send(msg);