import React from 'react';
import {renderer, noop, Container, RevasTouch, RevasTouchEvent} from 'revas/custom'
import App from './App';

function createRevasTouchEvent(e: TouchEvent): RevasTouchEvent {
  const touches: { [key: number]: RevasTouch } = {}
  const type: any = e.type === 'touchcancel' ? 'touchend' : e.type
  Object.values(e.changedTouches).forEach(touch => {
    // const { offsetLeft, offsetTop } = touch.target as HTMLCanvasElement
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
  const onTouch = (e: TouchEvent) => container.handleTouch(createRevasTouchEvent(e))

  wx.onTouchStart(onTouch)
  wx.onTouchMove(onTouch)
  wx.onTouchEnd(onTouch)
  wx.onTouchCancel(onTouch)

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