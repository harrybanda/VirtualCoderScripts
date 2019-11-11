"use strict";

function setup(args, ctx) {
  ctx.worldData.speech = new sumerian.Speech();
  ctx.worldData.speech.type = "ssml";
  ctx.worldData.speech.updateConfig({ entity: ctx.entity });

  const speechComponent = ctx.entity.getComponent("SpeechComponent");
  speechComponent.addSpeech(ctx.worldData.speech);
}
