const { h, Component } = preact;

function parseQuery(text) {
  var qs = text.slice(1).split('&');
  var ret = {};
  for (var i=0; i < qs.length; i++) {
    var q = qs[i].split('=');
    if (q.length > 0) {
      ret[decodeURIComponent(q[0])] = q[1]? decodeURIComponent(q[1]) : '';
    }
  }
  return ret;
}

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.props.defaultSettings, {
      valueChanged: false,
      prevSettings: this.props.defaultSettings,
    });
  }

  onPageSizeRadioClick(value) {
    return () => {
      if (this.state.pageSizeOption !== value) {
        this.setState({
          valueChanged: true,
          pageSizeOption: value,
        });
      }
    };
  }

  onPresetSelectChange(e) {
    if (e.target.value !== this.state.pageSizePresetSelect) {
      this.setState({
        valueChanged: true,
        pageSizePresetSelect: e.target.value,
      });
    }
  }

  onUseLandscapeCheckboxClick() {
    this.setState({
      valueChanged: true,
      pageSizeUseLandscape: !this.state.pageSizeUseLandscape,
    });
  }

  onWidthTextChange(e) {
    this.setState({
      valueChanged: true,
      pageSizeWidth: e.target.value,
    });
  }

  onHeightTextChange(e) {
    this.setState({
      valueChanged: true,
      pageSizeHeight: e.target.value,
    });
  }

  onOverrideCheckboxClick() {
    this.setState({
      valueChanged: true,
      overrideDocumentStylesheets: !this.state.overrideDocumentStylesheets,
    });
  }

  onPrintButtonClick() {
    if (this.state.valueChanged) {

    } else {
      window.print();
    }
  }

  onResetButtonClick() {
    this.setState({
      ...this.state.prevSettings,
      valueChanged: false,
    });
  }

  onApplyButtonClick() {
    const prevSettings = Object.keys(this.props.defaultSettings).reduce((obj, k) => {
      obj[k] = this.state[k];
      return obj;
    }, {});
    this.setState({
      prevSettings,
      valueChanged: false,
    });
    this.props.onApplySettings(prevSettings);
  }

  render() {
    const { vivliostyleState, version } = this.props;
    const {
      valueChanged,
      pageSizeOption,
      pageSizePresetSelect,
      pageSizeUseLandscape,
      pageSizeWidth,
      pageSizeHeight,
      overrideDocumentStylesheets
    } = this.state;

    const footerButton = valueChanged? [
      h('button', {className: 'Menu_footer-button cancel', onClick: this.onResetButtonClick.bind(this)}, 'Reset'),
      h('button', {className: 'Menu_footer-button', onClick: this.onApplyButtonClick.bind(this)}, 'Apply')
    ] : (vivliostyleState === 'loading' || vivliostyleState === 'interactive')? (
      h('button', {className: 'Menu_footer-button', disabled: true}, 'Rendering…')
    ) : (
      h('button', {className: 'Menu_footer-button', onClick: this.onPrintButtonClick.bind(this)}, 'Print')
    )

    return h('div', {className: 'Menu'},
      h('div', {className: 'Menu_content'},
        h('h3', null, 'Viola print previewer'),
        h('fieldset', {className: 'Menu_page-size'},
          h('legend', null,
            h('h4', null, 'Page Size')
          ),
          h('ul', null,
            h('li', {className: pageSizeOption === 'auto' ? 'selected' : ''},
              h('input', {
                type: 'radio',
                id: 'page-size_auto',
                checked: pageSizeOption === 'auto',
                onClick: this.onPageSizeRadioClick.bind(this)('auto')
              }),
              h('label', {for: 'page-size_auto'}, 'Auto')
            ),
            h('li', {className: pageSizeOption === 'preset' ? 'selected' : ''},
              h('input', {
                type: 'radio',
                id: 'page-size_preset',
                checked: pageSizeOption === 'preset',
                onClick: this.onPageSizeRadioClick.bind(this)('preset')
              }),
              h('label', {for: 'page-size_preset'}, 'Preset'),
              h('div', {className: 'Menu_subform'},
                h('div', {className: 'Menu_input-form'},
                  h('span', null, 'Size'),
                  h('select', {
                    value: pageSizePresetSelect,
                    onChange: this.onPresetSelectChange.bind(this)
                  },
                    h('option', {value: 'A5'}, 'A5'),
                    h('option', {value: 'A4'}, 'A4'),
                    h('option', {value: 'A3'}, 'A3'),
                    h('option', {value: 'B5'}, 'B5(ISO)'),
                    h('option', {value: 'B4'}, 'B4(ISO)'),
                    h('option', {value: 'JIS-B5'}, 'B5(JIS)'),
                    h('option', {value: 'JIS-B4'}, 'B4(JIS)'),
                    h('option', {value: 'letter'}, 'Letter'),
                    h('option', {value: 'legal'}, 'Legal'),
                    h('option', {value: 'ledger'}, 'Ledger')
                  )
                ),
                h('div', {className: 'Menu_input-form'},
                  h('input', {
                    type: 'checkbox',
                    id: 'page-size_landscape',
                    checked: pageSizeUseLandscape,
                    onClick: this.onUseLandscapeCheckboxClick.bind(this)
                  }),
                  h('label', {for: 'page-size_landscape'}, 'Landscape')
                )
              )
            ),
            h('li', {className: pageSizeOption === 'custom' ? 'selected' : ''},
              h('input', {
                type: 'radio',
                id: 'page-size_custom',
                checked: pageSizeOption === 'custom',
                onClick: this.onPageSizeRadioClick.bind(this)('custom')
              }),
              h('label', {for: 'page-size_custom'}, 'Custom'),
              h('div', {className: 'Menu_subform'},
                h('div', {className: 'Menu_input-form'},
                  h('label', {for: 'page-size_width'}, 'Width'),
                  h('input', {
                    type: 'text',
                    id: 'page-size_width',
                    size: 1,
                    value: pageSizeWidth,
                    onChange: this.onWidthTextChange.bind(this)
                  })
                ),
                h('div', {className: 'Menu_input-form'},
                  h('label', {for: 'page-size_height'}, 'Height'),
                  h('input', {
                    type: 'text',
                    id: 'page-size_height',
                    size: 1,
                    value: pageSizeHeight,
                    onChange: this.onHeightTextChange.bind(this)
                  })
                ),
              )
            )
          )
        ),
        h('div', null,
          h('input', {
            type: 'checkbox',
            id: 'override-stylesheets',
            checked: overrideDocumentStylesheets,
            onClick: this.onOverrideCheckboxClick.bind(this)
          }),
          h('label', {for: 'override-stylesheets'}, 'Override Document StyleSheets')
        )
      ),
      h('div', {className: 'Menu_footer'},
        h('div', {className: 'Menu_footer-text'},
          h('a', {href: 'https://github.com/pentapod/viola-savepdf'}, 'viola-savepdf'),
          version && h('span', {}, ' v' + version)
        ),
        h('div', {className: 'Menu_footer-text'},
          'Powered by ',
          h('a', {href: 'http://vivliostyle.com'}, 'Vivliostyle.js')
        ),
        h('div', {className: 'Menu_footer-button-area'},
          footerButton
        )
      )
    );
  }
}

class PageNavigator extends Component {

  onNavigationLeftClick() {
    window.viewer.navigateToPage('left');
  }

  onNavigationRightClick() {
    window.viewer.navigateToPage('right');
  }

  render() {
    return h('div', {className: 'PageNavigator'},
      h('div', {className: 'PageNavigator_navigation-left', onClick: this.onNavigationLeftClick.bind(this)}),
      h('div', {className: 'PageNavigator_navigation-right', onClick: this.onNavigationRightClick.bind(this)})
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);

    let renderUrl = null;
    const query = parseQuery(window.location.search);
    if (query.render) {
      // When vivliostyle loads document, we need to specify the html file.
      renderUrl = query.render;
      if (!renderUrl.match(/\.html?$/)) {
        if (renderUrl.charAt(renderUrl.length - 1) === '/') {
          renderUrl += 'index.html';
        } else {
          renderUrl += '/index.html';
        }
      }
    }
    let version = query.version || null;

    this.state = {
      vivliostyleState: 'loading',
      renderUrl,
      version,
    };
    this.defaultSettings = {
      pageSizeOption: 'auto',
      pageSizePresetSelect: 'A5',
      pageSizeUseLandscape: false,
      pageSizeWidth: '210mm',
      pageSizeHeight: '297mm',
      overrideDocumentStylesheets: false,
    };
  }

  getUserStyleSheetString({
    pageSizeOption,
    pageSizePresetSelect,
    pageSizeUseLandscape,
    pageSizeWidth,
    pageSizeHeight,
    overrideDocumentStylesheets,
  }) {
    let declaration = '';
    switch (pageSizeOption) {
      case 'auto':
        declaration += "auto";
        break;
      case 'preset':
        declaration += pageSizePresetSelect;
        if (pageSizeUseLandscape) {
          declaration += " landscape";
        }
        break;
      case 'custom':
        declaration += pageSizeWidth + " " + pageSizeHeight;
        break;
      default:
        throw new Error("Unknown mode " + this.mode());
    }
    if (overrideDocumentStylesheets) {
      declaration += " !important";
    }
    return `@page { size: ${declaration}; }`;
  }

  loadDocument(settings) {
    const { renderUrl } = this.state;
    if (!renderUrl) {
      return;
    }

    window.viewer.loadDocument([ renderUrl ], {
      userStyleSheet: [{
        text: this.getUserStyleSheetString(settings)
      }]
    }, {
      fitToScreen: true,
      pageViewMode: 'singlePage'
    });
  }

  componentDidMount() {
    window.viewer = new vivliostyle.viewer.Viewer({
      userAgentRootURL: '/node_modules/vivliostyle/resources/',
      viewportElement: document.getElementById('out'),
      debug: false
    });

    window.viewer.addListener('readystatechange', (e) => {
      const vivliostyleState = window.viewer.readyState;
      this.setState({ vivliostyleState });
    })

    this.loadDocument(this.defaultSettings);
  }

  render() {
    const { vivliostyleState, version } = this.state;

    return h('div', {className: 'App'},
      h(PageNavigator, null),
      h(Menu, {
        vivliostyleState,
        version,
        defaultSettings: this.defaultSettings,
        onApplySettings: this.loadDocument.bind(this)
      })
    );
  }
}

preact.render(h(App), document.getElementById('ui'));
