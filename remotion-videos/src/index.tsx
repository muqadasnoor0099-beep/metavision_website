import React from 'react'
import { Composition, registerRoot } from 'remotion'
import { MedicalExplainer } from './MedicalExplainer'
import { AccountingExplainer } from './AccountingExplainer'
import { HAEngageProExplainer } from './HAEngageProExplainer'

const FPS = 30
const WIDTH = 1920
const HEIGHT = 1080

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MedicalExplainer"
        component={MedicalExplainer}
        durationInFrames={FPS * 90}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AccountingExplainer"
        component={AccountingExplainer}
        durationInFrames={FPS * 90}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HAEngageProExplainer"
        component={HAEngageProExplainer}
        durationInFrames={2100}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  )
}

registerRoot(RemotionRoot)
