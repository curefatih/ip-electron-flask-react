import * as React from 'react';
import './App.scss';
import Button from './components/Button/Button';
import Accordion from './components/Accordion/Accordion';
import Input from './components/Input/Input';
import Dragable from './components/Dragable/Dragable';
import ImgContainer from './components/ImgContainer/ImgContainer';
declare global {
  interface Window { ipcRenderer: any; }
}

const ipcRenderer = window.ipcRenderer || {}
const videoURL = 'http://127.0.0.1:5001/video_feed';

function App() {

  const [states, setStates] = React.useState({
    showVideo: false,
    showedVideoURL: "",
    loadingInitialImage: "",
    initialImage: "",
    initialImageSize: {
      width: 0,
      height: 0
    },
    processedImgSize: {
      width: 0,
      height: 0
    },
    currentDisplay: "INITIAL",
    processedImgSrc: ""
  })

  const [transform, setTransform] = React.useState({
    angle: 45,
    resize: false,
    center: [0, 0]
  })

  const [swirl, setSwirl] = React.useState({
    center: [0, 0],
    strength: 0,
    radius: 0,
    rotation: 0
  })

  React.useEffect(() => {

    ipcRenderer.on('openFile', (event: any, base64: string) => {
      setStates({
        ...states,
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('rotate', (event: any, base64: string) => {
      setStates({
        ...states,
        currentDisplay: "ROTATE",
        initialImage: base64.toString()
      })
    })

    ipcRenderer.on('swirl', (event: any, base64: string) => {

      console.log(base64);

      setStates({
        ...states,
        currentDisplay: "SWIRL",
        initialImage: base64.toString()
      })
    })

  }, [])

  const handleRotate = () => {
    ipcRenderer.send('rotate', { args: transform, image: states.initialImage })
  }

  const handleSwirlButtonClick = () => {
    ipcRenderer.send('swirl', { args: swirl, image: states.initialImage })
  }

  return (
    <div className="App">

      <div
        className="content columns"

      >

        <div className="column is-four-fifths canvas_wrapper">
          <div
            id="canvas_container"

          >
            <ImgContainer
              src={states.showedVideoURL}
              className={states.showVideo ? "show" : "hide"}
            />

            {states.showVideo ? null
              :
              <>
                {states.initialImage !== "" ?
                  <><ImgContainer
                    src={'data:image/jpg;base64,' + states.initialImage}
                    onLoad={function (e: any) {
                      setStates({
                        ...states,
                        initialImageSize: {
                          width: e.target.naturalWidth,
                          height: e.target.naturalHeight
                        }
                      })
                      const center = [Math.floor(e.target.naturalWidth / 2), Math.floor(e.target.naturalHeight / 2)]
                      setTransform({
                        ...transform,
                        center
                      })
                      setSwirl({
                        ...swirl,
                        center
                      })
                    }}
                  />
                  </> : null
                }

                {states.processedImgSrc !== "" ?
                  <ImgContainer
                    src={'data:image/jpg;base64,' + states.processedImgSrc}
                    onLoad={function (e: any) {
                      setStates({
                        ...states,
                        processedImgSize: {
                          width: e.target.naturalWidth,
                          height: e.target.naturalHeight
                        }
                      })
                    }} /> : null
                }
              </>
            }
          </div>

          {!states.showVideo ?
            <Dragable
              showInstruction={states.initialImage === "" && !states.showVideo}
              onDrop={(e) => {
                //@ts-expect-error
                window.ipcRenderer.send('openFile', e.dataTransfer.files[0].path)
              }} />
            : null}
        </div>

        <div className="column side_menu">
          <Accordion title="Görüntü iyileştirme">
            123
         </Accordion>

          <Accordion title="Uzaysal Dönüşüm ve Eşitleme">
            <div className="rotate">
              <div className="options mb-3">
                <div className="center option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Center</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={transform.center[0]}
                      onChange={(e) => setTransform({ ...transform, center: [parseInt(e.target.value), transform.center[1]] })} />
                    <Input
                      placeholder="y"
                      type="number"
                      value={transform.center[1]}
                      id="rotate_center_y"
                      onChange={(e) => setTransform({ ...transform, center: [transform.center[0], parseInt(e.target.value)] })} />
                  </div>
                </div>
                <div className="angle option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Angle</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      min="1"
                      max="180"
                      value={transform.angle}
                      onChange={(e) => setTransform({ ...transform, angle: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="angle option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Resize</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      type="checkbox"
                      onChange={(e) => setTransform({ ...transform, resize: e.target.checked })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleRotate}
              >Rotate</Button>
            </div>

            <div className="swirl">
              <div className="options mb-3">
                <div className="center option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Center</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={swirl.center[0]}
                      onChange={(e) => setSwirl({ ...swirl, center: [parseInt(e.target.value), swirl.center[1]] })} />
                    <Input
                      placeholder="y"
                      type="number"
                      value={swirl.center[1]}
                      id="rotate_center_y"
                      onChange={(e) => setSwirl({ ...swirl, center: [swirl.center[0], parseInt(e.target.value)] })} />
                  </div>
                </div>
                <div className="strength option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Strength</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={swirl.strength}
                      onChange={(e) => setSwirl({ ...swirl, strength: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="radius option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Radius</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={swirl.radius}
                      onChange={(e) => setSwirl({ ...swirl, radius: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="rotation option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Rotation</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={swirl.rotation}
                      onChange={(e) => setSwirl({ ...swirl, rotation: parseInt(e.target.value) })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleSwirlButtonClick}
              >Swirl</Button>
            </div>
          </Accordion>

          <Accordion title="Yoğunluk Dönüşüm İşlemleri">
            <p>3</p>
          </Accordion>

          <Button
            className="primary"
            onClick={() => {
              setStates({
                ...states,
                showVideo: !states.showVideo,
                showedVideoURL: !states.showVideo ? videoURL : ""
              })
            }}
          >
            Videoda kenar belirleme
            </Button>

        </div>


      </div>
    </div>
  );
}

export default App;
