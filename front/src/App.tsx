import * as React from 'react';
import './App.scss';
import Button from './components/Button/Button';
import Accordion from './components/Accordion/Accordion';
import Input from './components/Input/Input';
import Dragable from './components/Dragable/Dragable';
import ImgContainer from './components/ImgContainer/ImgContainer';
import ImageViewer from './components/ImageViewer/ImageViewer';
import ErrorPop from './components/ErrorPop/ErrorPop';
import SuccessPop from './components/SuccessPop/SuccessPop';
import Loading from './components/Loading/Loading';

import cx from 'classnames';
declare global {
  interface Window { ipcRenderer: any; }
}

const ipcRenderer = window.ipcRenderer || {}
const videoURL = 'http://127.0.0.1:5001/video_feed';

function isBase64(str: string) {
  if (str === '' || str.trim() === '') { return false; }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}

function App() {
  const contentRef = React.useRef(null);
  const stateRef = React.useRef();

  const [states, setStates] = React.useState({
    showVideo: false,
    showedVideoURL: "",
    isLoading: false,
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
    processedImgSrc: "",
    warningMessage: "",
    showWarningMessage: false,
    succesMessage: "",
    showSuccessMessage: false
  })

  const [histogramModal, setHistogramModal] = React.useState({
    showHistogramModal: false,
    histogramImageData: ""
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

  const [eqHist, setEqHist] = React.useState({
    bins: 256
  })

  const [gamma, setGamma] = React.useState({
    gamma: 1,
    gain: 1
  })

  const [equalizeAdaptHist, setEqualizeAdaptHist] = React.useState({
    kernel_size: 0,
    clip_limit: 0.01,
    nbins: 256
  })

  const [windowFilter, setWindow] = React.useState({
    window_type: "hann"
  })

  const [crop, setCrop] = React.useState({
    x: [0, 0],
    y: [0, 0]
  })

  const [resize, setResize] = React.useState({
    output_shape: [0, 0]
  })

  const [affineTransform, setAffineTransform] = React.useState({
    scale: 0,
    rotation: 0,
    shear: 0,
    translation: [0, 0]
  })

  const [sato, setSato] = React.useState({
    black_ridges: true,
    mode: 'constant',
    cval: 0.0,
  })

  const [sobel, setSobel] = React.useState({
    axis: 0,
    mode: 'constant',
    cval: 0.0,
  })

  const [prewitt, setPrewitt] = React.useState({
    axis: 0,
    mode: 'constant',
    cval: 0.0,
  })

  const [laplace, setLaplace] = React.useState({
    ksize: 3
  })

  const [unsharp, setUnsharp] = React.useState({
    radius: 0,
    amount: 0,
    multichannel: false,
  })

  const [meijering, setMeijering] = React.useState({
    alpha: 0,
    black_ridges: true,
    mode: 'constant',
    cval: 0.0,
  })

  const [scharr, setScharr] = React.useState({
    axis: 0,
    mode: 'constant',
    cval: 0.0,
  })

  const [hysteresis, setHysteresis] = React.useState({
    low: 0,
    high: 0
  })

  const [convexHull, setConvexHull] = React.useState({
    offset_coordinates: false,
    tolerance: 0
  })

  const [thin, setThin] = React.useState({
    max_iter: 0
  })

  const [activeContour, setActiveContour] = React.useState({
    row: 100,
    column: 200,
    radius: 200,
  })

  React.useEffect(() => {
    (stateRef as any).current = states; // Write it to the ref
  });

  const dataOrError = React.useCallback((str, type) => {
    const currentState: any = stateRef.current;
    const data: string = str.toString()
    if (isBase64(data)) {
      setStates({
        ...currentState,
        isLoading: false,
        currentDisplay: type,
        processedImgSrc: data
      })
    } else {
      setStates({
        ...currentState,
        isLoading: false,
        warningMessage: str,
        showWarningMessage: true
      })
    }
  }, [stateRef])

  const saveFileHandler = React.useCallback((message: string) => {
    const currentState: any = stateRef.current; // Read it from the ref
    setStates({
      ...currentState,
      isLoading: false,
      showSuccessMessage: true,
      succesMessage: message
    })
  }, [stateRef])

  const errorHandler = React.useCallback((message: string) => {
    const currentState: any = stateRef.current; // Read it from the ref
    setStates({
      ...currentState,
      isLoading: false,
      showWarningMessage: true,
      warningMessage: message
    })
  }, [stateRef])

  React.useEffect(() => {

    ipcRenderer.on('openFile', (event: any, base64: string) => {
      setStates({
        ...states,
        initialImage: base64.toString(),
        processedImgSrc: ""
      })
    })

    ipcRenderer.on('saveFile', (event: any, message: string) => {
      saveFileHandler(message)
    })

    ipcRenderer.on('error', (event: any, message: string) => {
      errorHandler(message)
    })

    ipcRenderer.on('rotate', (event: any, base64: string) => {
      dataOrError(base64, "ROTATE")
    })

    ipcRenderer.on('swirl', (event: any, base64: string) => {
      dataOrError(base64, "SWIRL")
    })

    ipcRenderer.on('gamma', (event: any, base64: string) => {
      dataOrError(base64, "GAMMA")
    })

    ipcRenderer.on('equalize_adapthist', (event: any, base64: string) => {
      dataOrError(base64, "EQ_ADAPT_HIST")
    })

    ipcRenderer.on('eq_hist', (event: any, base64: string) => {
      dataOrError(base64, "EQ_HIST")
    })

    ipcRenderer.on('show_histogram', (event: any, base64: string) => {
      const data = base64.toString()
      if (isBase64(data))
        setHistogramModal({
          ...histogramModal,
          showHistogramModal: true,
          histogramImageData: 'data:image/png;base64,' + base64.toString()
        })
    })

    ipcRenderer.on('window', (event: any, base64: string) => {
      dataOrError(base64, "WINDOW")
    })

    ipcRenderer.on('median', (event: any, base64: string) => {
      dataOrError(base64, "MEDIAN")
    })

    ipcRenderer.on('crop', (event: any, base64: string) => {
      dataOrError(base64, "CROP")
    })

    ipcRenderer.on('resize', (event: any, base64: string) => {
      dataOrError(base64, "RESIZE")
    })

    ipcRenderer.on('affine_transform', (event: any, base64: string) => {
      dataOrError(base64, "AFFINE_TRANSFORM")
    })

    ipcRenderer.on('sato', (event: any, base64: string) => {
      dataOrError(base64, "SATO")
    })

    ipcRenderer.on('sobel', (event: any, base64: string) => {
      dataOrError(base64, "SOBEL")
    })

    ipcRenderer.on('prewitt', (event: any, base64: string) => {
      dataOrError(base64, "PREWITT")
    })

    ipcRenderer.on('laplace', (event: any, base64: string) => {
      dataOrError(base64, "LAPLACE")
    })

    ipcRenderer.on('unsharp_mask', (event: any, base64: string) => {
      dataOrError(base64, "UNSHARP_MASK")
    })

    ipcRenderer.on('meijering', (event: any, base64: string) => {
      dataOrError(base64, "MEIJERING")
    })

    ipcRenderer.on('scharr', (event: any, base64: string) => {
      dataOrError(base64, "SCHARR")
    })

    ipcRenderer.on('hysteresis_threshold', (event: any, base64: string) => {
      dataOrError(base64, "HYSTERESIS_THRESHOLD")
    })

    ipcRenderer.on('erosion', (event: any, base64: string) => {
      dataOrError(base64, "EROSION")
    })

    ipcRenderer.on('dilation', (event: any, base64: string) => {
      dataOrError(base64, "DILATION")
    })

    ipcRenderer.on('opening', (event: any, base64: string) => {
      dataOrError(base64, "OPENING")
    })

    ipcRenderer.on('skeletonize', (event: any, base64: string) => {
      dataOrError(base64, "SKELETONIZE")
    })

    ipcRenderer.on('convex_hull', (event: any, base64: string) => {
      dataOrError(base64, "CONVEX_HULL")
    })

    ipcRenderer.on('closing', (event: any, base64: string) => {
      dataOrError(base64, "CLOSING")
    })

    ipcRenderer.on('white_tophat', (event: any, base64: string) => {
      dataOrError(base64, "WHITE_TOPHAT")
    })

    ipcRenderer.on('thin', (event: any, base64: string) => {
      dataOrError(base64, "THIN")
    })

    ipcRenderer.on('black_tophat', (event: any, base64: string) => {
      dataOrError(base64, "BLACK_TOPHAT")
    })

    ipcRenderer.on('medial_axis', (event: any, base64: string) => {
      dataOrError(base64, "MEDIAL_AXIS")
    })
    /*****************************not working */


    /***************************** in progress */

    ipcRenderer.on('active_contour', (event: any, base64: string) => {
      dataOrError(base64, "ACTIVE_CONTOUR")
    })

  }, [])

  // React.useEffect(() => {
  //   console.log(states);

  // }, [states])

  const handleRotate = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('rotate', { args: transform, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleSwirlButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('swirl', { args: swirl, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleEqHistButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('eq_hist', { args: eqHist, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleGammaButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('gamma', { args: gamma, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleEqAdaptHistButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('equalize_adapthist', { args: equalizeAdaptHist, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleShowHistogramButtonClick = () => {
    // setStates({ ...states, isLoading: true })
    ipcRenderer.send('show_histogram', { image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleWindowButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('window', { args: windowFilter, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleMedianButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('median', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleCropButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('crop', { args: crop, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleResizeButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('resize', { args: resize, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleAffineTransformButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('affine_transform', { args: affineTransform, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleSatoButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('sato', { args: sato, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleSobelButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('sobel', { args: sobel, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handlePrewittButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('prewitt', { args: prewitt, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleLaplaceButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('laplace', { args: laplace, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleUnsharpMaskButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('unsharp_mask', { args: unsharp, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleMeijeringButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('meijering', { args: meijering, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleScharrButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('scharr', { args: scharr, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleHysteresisThresholdButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('hysteresis_threshold', { args: hysteresis, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleErosionButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('erosion', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleDilationButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('dilation', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleOpeningButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('opening', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleSkeletonizeButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('skeletonize', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleConvexHullButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('convex_hull', { args: convexHull, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleClosingButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('closing', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleWhiteTophatButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('white_tophat', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleThinButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('thin', { args: thin, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleBlackTophatButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('black_tophat', { args: thin, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleMedialAxisButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('medial_axis', { args: {}, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  const handleContourButtonClick = () => {
    setStates({ ...states, isLoading: true })
    ipcRenderer.send('active_contour', { args: activeContour, image: states.processedImgSrc !== "" ? states.processedImgSrc : states.initialImage })
  }

  return (
    <div
      className="App"
    >

      <div
        className="content columns"
        ref={contentRef}
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

                      setResize({
                        ...resize,
                        output_shape: [e.target.naturalHeight, e.target.naturalWidth]
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
                    }} /> : ""
                }
              </>
            }
          </div>

          {!states.showVideo ?
            <Dragable
              showInstruction={states.initialImage === "" && !states.showVideo}
              onDrop={(e) => {
                //@ts-expect-error
                if (e.dataTransfer.files[0] && e.dataTransfer.files[0].path)
                  //@ts-expect-error
                  window.ipcRenderer.send('openFile', e.dataTransfer.files[0].path)
              }} />
            : null}
          {!states.showVideo && states.initialImage !== "" ?
            <div className="download-button">
              <Button
                onClick={() => {
                  setStates({ ...states, isLoading: true })
                  ipcRenderer.send('saveFile', states.initialImage)
                }}
              >
                Görüntüyü kaydet</Button>
            </div> : null}

          {!states.showVideo && states.initialImage !== "" && states.processedImgSrc !== "" ?
            <div className="base-image-button">
              <Button
                onClick={() => {
                  setStates({
                    ...states,
                    processedImgSrc: ""
                  })
                }}
              >İlk görüntüye dön</Button>
            </div> : null}

          <ImageViewer
            show={histogramModal.showHistogramModal}
            src={histogramModal.histogramImageData}
            onClose={() => setHistogramModal({ ...histogramModal, showHistogramModal: false })}
          />
        </div>

        <div className="column side_menu">
          <Accordion title="Görüntü iyileştirme">
            <div className="window">
              <div className="options mb-3">

                <div className="window_type option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Window_type</h6>
                  </div>
                  <div className="inputs column">
                    <select onChange={(e) => setWindow({ ...windowFilter, window_type: e.target.value })}>
                      <option value="boxcar">boxcar</option>
                      <option value="triang">triang</option>
                      <option value="blackman">blackman</option>
                      <option value="hamming">hamming</option>
                      <option value="hann">hann</option>
                      <option value="bartlett">bartlett</option>
                      <option value="flattop">flattop</option>
                      <option value="parzen">parzen</option>
                      <option value="bohman">bohman</option>
                      <option value="blackmanharris">blackmanharris</option>
                      <option value="nuttall">nuttall</option>
                      <option value="barthann">barthann</option>
                    </select>
                  </div>
                </div>

                <div className="shape option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Shape</h6>
                  </div>
                  <div className="inputs column">
                    <p>*görüntü "shape" değeri kullanılıyor.</p>
                  </div>
                </div>

                <div className="kwargs option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Warp_kwargs</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleWindowButtonClick}
              >Window</Button>
            </div>

            <div className="median">
              <div className="options mb-3">

                <div className="window_type option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'ball(5)' kullanılıyor.</p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*görüntü "dtype" değeri kullanılıyor.</p>
                  </div>
                </div>

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mode</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="behaviour option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Behaviour</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleMedianButtonClick}
              >Median</Button>
            </div>

            <div className="sato">
              <div className="options mb-3">

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Sigmas</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Black_ridged</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      checked={sato.black_ridges}
                      onChange={(e) => setSato({ ...sato, black_ridges: e.target.checked })}
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mode</h6>
                  </div>
                  <div className="inputs column">
                    <select value={sato.mode} onChange={(e) => setSato({ ...sato, mode: e.target.value })}>
                      <option value="constant">constant</option>
                      <option value="reflect">reflect</option>
                      <option value="wrap">wrap</option>
                      <option value="nearest">nearest</option>
                      <option value="mirror">mirror</option>
                    </select>
                  </div>
                </div>


                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="cval"
                      type="number"
                      value={sato.cval}
                      onChange={(e) => setSato({ ...sato, cval: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleSatoButtonClick}
              >Sato</Button>
            </div>

            <div className="sobel">
              <div className="options mb-3">

                <div className="mask option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mask</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="axis option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Axis</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="axis"
                      type="number"
                      value={sobel.axis}
                      onChange={(e) => setSobel({ ...sobel, axis: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mode</h6>
                  </div>
                  <div className="inputs column">
                    <select value={sobel.mode} onChange={(e) => setSobel({ ...sobel, mode: e.target.value })}>
                      <option value="constant">constant</option>
                      <option value="reflect">reflect</option>
                      <option value="wrap">wrap</option>
                      <option value="nearest">nearest</option>
                      <option value="mirror">mirror</option>
                    </select>
                  </div>
                </div>


                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="cval"
                      type="number"
                      value={sobel.cval}
                      onChange={(e) => setSobel({ ...sobel, cval: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleSobelButtonClick}
              >Sobel</Button>
            </div>

            <div className="prewitt">
              <div className="options mb-3">

                <div className="mask option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mask</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="axis option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Axis</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="axis"
                      type="number"
                      value={sobel.axis}
                      onChange={(e) => setPrewitt({ ...prewitt, axis: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mode</h6>
                  </div>
                  <div className="inputs column">
                    <select value={sobel.mode} onChange={(e) => setPrewitt({ ...prewitt, mode: e.target.value })}>
                      <option value="constant">constant</option>
                      <option value="reflect">reflect</option>
                      <option value="wrap">wrap</option>
                      <option value="nearest">nearest</option>
                      <option value="mirror">mirror</option>
                    </select>
                  </div>
                </div>


                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="cval"
                      type="number"
                      value={sobel.cval}
                      onChange={(e) => setPrewitt({ ...prewitt, cval: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handlePrewittButtonClick}
              >Prewitt</Button>
            </div>

            <div className="laplace">
              <div className="options mb-3">

                <div className="mask option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mask</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="ksize option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Ksize</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="cval"
                      type="number"
                      value={laplace.ksize}
                      onChange={(e) => setLaplace({ ...laplace, ksize: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleLaplaceButtonClick}
              >Laplace</Button>
            </div>

            <div className="unsharp_mask">
              <div className="options mb-3">

                <div className="radius option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Radius</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="radius"
                      type="number"
                      value={unsharp.radius}
                      onChange={(e) => setUnsharp({ ...unsharp, radius: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="amount option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Amount</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="amount"
                      type="number"
                      value={unsharp.amount}
                      onChange={(e) => setUnsharp({ ...unsharp, amount: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="multichannel option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Multichannel</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      type="checkbox"
                      checked={unsharp.multichannel}
                      onChange={(e) => setUnsharp({ ...unsharp, multichannel: e.target.checked })}
                    />
                  </div>
                </div>

                <div className="preserve_range option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Preserve range</h6>
                  </div>
                  <div className="inputs column">
                    <p>* float dönüşümüne zorlanmaması için "False" kabul edildi.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleUnsharpMaskButtonClick}
              >Unsharp Mask</Button>
            </div>

            <div className="meijering">
              <div className="options mb-3">

                <div className="sigmas option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Sigmas</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="alpha option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Alpha</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="cval"
                      type="number"
                      value={meijering.alpha}
                      onChange={(e) => setMeijering({ ...meijering, alpha: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Black_ridged</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      checked={meijering.black_ridges}
                      onChange={(e) => setMeijering({ ...meijering, black_ridges: e.target.checked })}
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mode</h6>
                  </div>
                  <div className="inputs column">
                    <select value={meijering.mode} onChange={(e) => setMeijering({ ...meijering, mode: e.target.value })}>
                      <option value="constant">constant</option>
                      <option value="reflect">reflect</option>
                      <option value="wrap">wrap</option>
                      <option value="nearest">nearest</option>
                      <option value="mirror">mirror</option>
                    </select>
                  </div>
                </div>


                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="cval"
                      type="number"
                      value={meijering.cval}
                      onChange={(e) => setMeijering({ ...meijering, cval: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleMeijeringButtonClick}
              >Meijering</Button>
            </div>

            <div className="scharr">
              <div className="options mb-3">

                <div className="mask option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mask</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor.</p>
                  </div>
                </div>

                <div className="axis option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Axis</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="axis"
                      type="number"
                      value={scharr.axis}
                      onChange={(e) => setScharr({ ...scharr, axis: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="mode option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mode</h6>
                  </div>
                  <div className="inputs column">
                    <select value={scharr.mode} onChange={(e) => setScharr({ ...scharr, mode: e.target.value })}>
                      <option value="constant">constant</option>
                      <option value="reflect">reflect</option>
                      <option value="wrap">wrap</option>
                      <option value="nearest">nearest</option>
                      <option value="mirror">mirror</option>
                    </select>
                  </div>
                </div>


                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Cval</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="cval"
                      type="number"
                      value={scharr.cval}
                      onChange={(e) => setScharr({ ...scharr, cval: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleScharrButtonClick}
              >Scharr</Button>
            </div>

            <div className="hysteresis_threshold">
              <div className="options mb-3">

                <div className="axis option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Low</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="low"
                      type="number"
                      value={hysteresis.low}
                      onChange={(e) => setHysteresis({ ...hysteresis, low: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="cval option columns">
                  <div className="option_title column has-text-centered">
                    <h6>High</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="high"
                      type="number"
                      value={hysteresis.high}
                      onChange={(e) => setHysteresis({ ...hysteresis, high: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleHysteresisThresholdButtonClick}
              >Hysteresis Threshold</Button>
            </div>

          </Accordion>

          <Accordion title="Morfolojik işlemler">

            <div className="erosion">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*disk(6) değeri kullanılıyor. - yarıçapı 6 birim olan yuvarlak </p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'None' değeri kullanılıyor. - yeni bir dizi olarak ele alınacak</p>
                  </div>
                </div>

                <div className="shift_x shift_y option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Shift_x, Shift_y</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor. - disk(6) merkezde olacak şekilde ele alınacak.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleErosionButtonClick}
              >Erosion</Button>
            </div>

            <div className="dilation">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*disk(6) değeri kullanılıyor. - yarıçapı 6 birim olan yuvarlak </p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'None' değeri kullanılıyor. - yeni bir dizi olarak ele alınacak</p>
                  </div>
                </div>

                <div className="shift_x shift_y option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Shift_x, Shift_y</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değerler kullanılıyor. - disk(6) merkezde olacak şekilde ele alınacak.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleDilationButtonClick}
              >Dilation</Button>
            </div>

            <div className="opening">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*disk(6) değeri kullanılıyor. - yarıçapı 6 birim olan yuvarlak </p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'None' değeri kullanılıyor. - yeni bir dizi olarak ele alınacak</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleOpeningButtonClick}
              >Opening</Button>
            </div>

            <div className="closing">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*disk(6) değeri kullanılıyor. - yarıçapı 6 birim olan yuvarlak </p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'None' değeri kullanılıyor. - yeni bir dizi olarak ele alınacak</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleClosingButtonClick}
              >Closing</Button>
            </div>

            <div className="skeletonize">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Method</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değer kullanılıyor. - lee</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleSkeletonizeButtonClick}
              >Skeletonize</Button>
            </div>

            <div className="convex_hull">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Offset_coordinates</h6>
                  </div>
                  <div className="inputs column">
                    <input
                      checked={convexHull.offset_coordinates}
                      onChange={(e) => { setConvexHull({ ...convexHull, offset_coordinates: e.target.checked }) }}
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="axis option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Tolerance</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="tolerance"
                      type="number"
                      value={convexHull.tolerance}
                      onChange={(e) => setConvexHull({ ...convexHull, tolerance: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <Button
                className="secondary"
                onClick={handleConvexHullButtonClick}
              >Convex Hull</Button>
            </div>

            <div className="white_tophat">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*disk(1) değeri kullanılıyor. - yarıçapı 1 birim olan yuvarlak </p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'None' değeri kullanılıyor. - yeni bir dizi olarak ele alınacak</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleWhiteTophatButtonClick}
              >White Tophat</Button>
            </div>

            <div className="black_tophat">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Selem</h6>
                  </div>
                  <div className="inputs column">
                    <p>*disk(1) değeri kullanılıyor. - yarıçapı 1 birim olan yuvarlak </p>
                  </div>
                </div>

                <div className="out option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Out</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'None' değeri kullanılıyor. - yeni bir dizi olarak ele alınacak</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleBlackTophatButtonClick}
              >Black Tophat</Button>
            </div>

            <div className="thin">
              <div className="options mb-3">

                <div className="selem option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Max_iter</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="max_iter"
                      type="number"
                      value={thin.max_iter}
                      onChange={(e) => setThin({ ...thin, max_iter: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleThinButtonClick}
              >Thin</Button>
            </div>

            <div className="medial_axis">
              <div className="options mb-3">

                <div className="mask option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Mask</h6>
                  </div>
                  <div className="inputs column">
                    <p>*varsayılan değer kullanılıyor.</p>
                  </div>
                </div>

                <div className="return_distance option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Return_distance</h6>
                  </div>
                  <div className="inputs column">
                    <p>*'False' kullanılıyor.</p>
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleMedialAxisButtonClick}
              >Medial Axis</Button>
            </div>


          </Accordion>

          <Accordion title="Histogram Görüntüleme ve Eşitleme">

            <div className="show_eq_hist">
              <div className="options mb-3">
              </div>
              <Button
                className="secondary"
                onClick={handleShowHistogramButtonClick}
              >Show Histogram</Button>
            </div>

            <div className="eq_hist">
              <div className="options mb-3">

                <div className="bins option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Bins</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      min="1"
                      max="180"
                      value={eqHist.bins}
                      onChange={(e) => setEqHist({ ...eqHist, bins: parseInt(e.target.value) })} />
                  </div>
                </div>


              </div>
              <Button
                className="secondary"
                onClick={handleEqHistButtonClick}
              >Equalize Histogram</Button>
            </div>

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

            <div className="crop">
              <div className="options mb-3">

                <div className="x_from option columns">
                  <div className="option_title column has-text-centered">
                    <h6>x_from</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={crop.x[0]}
                      onChange={(e) => setCrop({ ...crop, x: [parseInt(e.target.value), crop.x[1]] })} />
                  </div>
                </div>

                <div className="x_to option columns">
                  <div className="option_title column has-text-centered">
                    <h6>x_from</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={crop.x[1]}
                      onChange={(e) => setCrop({ ...crop, x: [crop.x[0], parseInt(e.target.value)] })} />
                  </div>
                </div>

                <div className="y_from option columns">
                  <div className="option_title column has-text-centered">
                    <h6>y_from</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="y_from"
                      type="number"
                      value={crop.y[0]}
                      onChange={(e) => setCrop({ ...crop, y: [parseInt(e.target.value), crop.y[1]] })} />
                  </div>
                </div>

                <div className="y_to option columns">
                  <div className="option_title column has-text-centered">
                    <h6>y_to</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="y"
                      type="number"
                      value={crop.y[1]}
                      onChange={(e) => setCrop({ ...crop, y: [crop.y[0], parseInt(e.target.value)] })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleCropButtonClick}
              >Crop</Button>
            </div>

            <div className="resize">
              <div className="options mb-3">

                <div className="rows option columns">
                  <div className="option_title column has-text-centered">
                    <h6>y</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={resize.output_shape[0]}
                      onChange={(e) => setResize({ ...resize, output_shape: [parseInt(e.target.value), resize.output_shape[1]] })} />
                  </div>
                </div>

                <div className="x_to option columns">
                  <div className="cols column has-text-centered">
                    <h6>x</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="x"
                      type="number"
                      value={resize.output_shape[1]}
                      onChange={(e) => setResize({ ...resize, output_shape: [resize.output_shape[0], parseInt(e.target.value)] })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleResizeButtonClick}
              >Resize</Button>
            </div>

            <div className="affine_trasnform">
              <div className="options mb-3">

                <div className="matrix option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Matrix</h6>
                  </div>
                  <div className="inputs column">
                    *varsayılan değer kullanıldı. - (3,3) homojen transformation matrix
                  </div>
                </div>

                <div className="radius option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Rotation</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="rotation"
                      type="number"
                      value={affineTransform.rotation}
                      onChange={(e) => setAffineTransform({ ...affineTransform, rotation: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="hough_normalize option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Scale</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="scale"
                      type="number"
                      value={affineTransform.scale}
                      onChange={(e) => setAffineTransform({ ...affineTransform, scale: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="full_output option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Shear</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="shear"
                      type="number"
                      value={affineTransform.shear}
                      onChange={(e) => setAffineTransform({ ...affineTransform, shear: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="full_output option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Translation</h6>
                  </div>
                  <div className="inputs column">
                    x
                    <Input
                      placeholder="translation_x"
                      type="number"
                      value={affineTransform.translation[0]}
                      onChange={(e) => setAffineTransform({ ...affineTransform, translation: [parseFloat(e.target.value), affineTransform.translation[1]] })} />
                    y
                    <Input
                      placeholder="translation_y"
                      type="number"
                      value={affineTransform.translation[1]}
                      onChange={(e) => setAffineTransform({ ...affineTransform, translation: [affineTransform.translation[0], parseFloat(e.target.value)] })} />
                  </div>
                </div>

              </div>
              <Button
                className="secondary"
                onClick={handleAffineTransformButtonClick}
              >Affine Transform</Button>
            </div>

          </Accordion>

          <Accordion title="Yoğunluk Dönüşüm İşlemleri">


            <div className="gamma">
              <div className="options mb-3">

                <div className="gamma option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Gamma</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={gamma.gamma}
                      onChange={(e) => setGamma({ ...gamma, gamma: parseFloat(e.target.value) })} />
                  </div>
                </div>


                <div className="gamma option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Gain</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={gamma.gain}
                      onChange={(e) => setGamma({ ...gamma, gain: parseFloat(e.target.value) })} />
                  </div>
                </div>


              </div>
              <Button
                className="secondary"
                onClick={handleGammaButtonClick}
              >Gamma</Button>
            </div>


            <div className="eq_adaphist">
              <div className="options mb-3">

                <div className="clip_limit option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Kernel_size</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="None"
                      type="number"
                      value={equalizeAdaptHist.kernel_size || ""}
                      onChange={(e) => setEqualizeAdaptHist({ ...equalizeAdaptHist, kernel_size: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="clip_limit option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Clip_limit</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={equalizeAdaptHist.clip_limit}
                      onChange={(e) => setEqualizeAdaptHist({ ...equalizeAdaptHist, clip_limit: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="nbins option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Nbins</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={equalizeAdaptHist.nbins}
                      onChange={(e) => setEqualizeAdaptHist({ ...equalizeAdaptHist, nbins: parseInt(e.target.value) })} />
                  </div>
                </div>


              </div>
              <Button
                className="secondary"
                onClick={handleEqAdaptHistButtonClick}
              >Equalize Adapt Histogram(CLAHE)</Button>
            </div>

          </Accordion>

          <Accordion title="Active contour">

            <div className="active_contour">
              <div className="options mb-3">

                <div className="column option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Column</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={activeContour.column}
                      onChange={(e) => setActiveContour({ ...activeContour, column: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="row option columns">
                  <div className="option_title column has-text-centered">
                    <h6>Row</h6>
                  </div>
                  <div className="inputs column">
                    <Input
                      placeholder="degree"
                      type="number"
                      value={activeContour.row}
                      onChange={(e) => setActiveContour({ ...activeContour, row: parseInt(e.target.value) })} />
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
                      value={activeContour.radius}
                      onChange={(e) => setActiveContour({ ...activeContour, radius: parseInt(e.target.value) })} />
                  </div>
                </div>

              </div>
              <Button
                className="primary"
                onClick={handleContourButtonClick}
              >Uygula</Button>
            </div>


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

        <Loading
          show={states.isLoading}
        />

      </div>

      <ErrorPop
        error={states.warningMessage || ""}
        message={`Uygulama esnasında hata meydana geldi.\n Parametrelerin doğruluğundan ve görüntünün varlığından emin olun.`}
        show={states.showWarningMessage}
        onClose={() => {
          setStates({ ...states, showWarningMessage: false, warningMessage: "" })
        }}
      />

      <SuccessPop
        success={states.succesMessage || ""}
        message={`İşlem başarılı`}
        show={states.showSuccessMessage}
        onClose={() => setStates({ ...states, showSuccessMessage: false, succesMessage: "" })}
      />
    </div >
  );
}

export default App;
