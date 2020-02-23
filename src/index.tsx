import React from 'react';
import {renderer, noop, Container, RevasTouch, RevasTouchEvent} from 'revas/custom'
import App from './App';

function createRevasTouchEvent(e: TouchEvent, type: any = e.type): RevasTouchEvent {
  const touches: { [key: number]: RevasTouch } = {}
  type = type === 'touchcancel' ? 'touchend' : type
  Object.values(e.changedTouches).forEach(touch => {
    touches[touch.identifier] = {
      identifier: touch.identifier,
      x: touch.clientX,
      y: touch.clientY
    }
  })
  return { type, touches, timestamp: e.timeStamp || Date.now() }
}

function render(app: React.ReactNode, canvas: HTMLCanvasElement) {
  const {windowWidth, windowHeight, devicePixelRatio} = wx.getSystemInfoSync()
  canvas.width = windowWidth * devicePixelRatio
  canvas.height = windowHeight * devicePixelRatio
  const ctx = canvas.getContext('2d')
  ctx?.scale(devicePixelRatio, devicePixelRatio)

  wx.onTouchStart((e: any) => container.handleTouch(createRevasTouchEvent(e, 'touchstart')))
  wx.onTouchMove((e: any) => container.handleTouch(createRevasTouchEvent(e, 'touchmove')))
  wx.onTouchEnd((e: any) => container.handleTouch(createRevasTouchEvent(e, 'touchend')))
  wx.onTouchCancel((e: any) => container.handleTouch(createRevasTouchEvent(e, 'touchcancel')))

  const container = new Container(ctx, windowWidth, windowHeight)
  const fiber = renderer.createContainer(container, false, false)
  renderer.updateContainer(app, fiber, null, noop)
  return {
    unmount() {
      renderer.updateContainer(null, fiber, null, noop)
      container.destory()
    }
  }
}

render(React.createElement(App), canvas)


declare const wx: any
declare const canvas: any