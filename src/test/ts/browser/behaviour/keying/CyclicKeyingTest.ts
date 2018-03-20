import { FocusTools, Keyboard, Keys, Step } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { Objects } from '@ephox/boulder';
import * as Behaviour from 'ephox/alloy/api/behaviour/Behaviour';
import { Focusing } from 'ephox/alloy/api/behaviour/Focusing';
import { Keying } from 'ephox/alloy/api/behaviour/Keying';
import { Tabstopping } from 'ephox/alloy/api/behaviour/Tabstopping';
import * as GuiFactory from 'ephox/alloy/api/component/GuiFactory';
import { Button } from 'ephox/alloy/api/ui/Button';
import { Container } from 'ephox/alloy/api/ui/Container';
import GuiSetup from 'ephox/alloy/test/GuiSetup';

UnitTest.asynctest('Cyclic Keying Test', function () {
  const success = arguments[arguments.length - 2];
  const failure = arguments[arguments.length - 1];

  GuiSetup.setup(function (store, doc, body) {
    const makeButton = function (v, t) {
      return Button.sketch({
        dom: { tag: 'button', innerHtml: t },
        action: store.adder(v + '.clicked'),
        buttonBehaviours: Behaviour.derive([
          Tabstopping.config({ })
        ])
      });
    };

    return GuiFactory.build(
      Container.sketch({
        dom: {
          tag: 'div',
          classes: [ 'cyclic-keying-test'],
          styles: {
            background: 'blue',
            width: '200px',
            height: '200px'
          }
        },
        uid: 'custom-uid',
        containerBehaviours: Behaviour.derive([
          Keying.config({
            mode: 'cyclic'
          })
        ]),
        components: [
          makeButton('button1', 'Button1'),
          makeButton('button2', 'Button2'),
          Container.sketch({
            dom: {
              tag: 'span',
              classes: [ 'focusable-span' ],
              styles: {
                display: 'inline-block',
                width: '200px',
                border: '1px solid green',
                background: 'white',
                height: '20px'
              }
            },
            containerBehaviours: Behaviour.derive([
              Tabstopping.config({ }),
              Focusing.config({ })
            ])
          })
        ]
      })
    );

  }, function (doc, body, gui, component, store) {
    return [
      GuiSetup.mSetupKeyLogger(body),
      Step.sync(function () {
        Keying.focusIn(component);
      }),
      FocusTools.sTryOnSelector(
        'Focus should be on button 1 after focusIn',
        doc,
        'button:contains("Button1")'
      ),
      Keyboard.sKeydown(doc, Keys.tab(), {}),
      FocusTools.sTryOnSelector(
        'Focus should move from button 1 to button 2',
        doc,
        'button:contains("Button2")'
      ),
      Keyboard.sKeydown(doc, Keys.tab(), {}),
      FocusTools.sTryOnSelector(
        'Focus should move from button 2 to span',
        doc,
        'span.focusable-span'
      ),

      Keyboard.sKeydown(doc, Keys.tab(), {}),
      FocusTools.sTryOnSelector(
        'Focus should move from span to button 1',
        doc,
        'button:contains("Button1")'
      ),

      Keyboard.sKeydown(doc, Keys.tab(), { shift: true }),
      FocusTools.sTryOnSelector(
        'Focus should move from button1 to span',
        doc,
        'span.focusable-span'
      ),

      Keyboard.sKeydown(doc, Keys.tab(), { shift: true }),
      FocusTools.sTryOnSelector(
        'Focus should move from span to button 2',
        doc,
        'button:contains("Button2")'
      ),

      Keyboard.sKeydown(doc, Keys.tab(), { shift: true }),
      FocusTools.sTryOnSelector(
        'Focus should move from button2 to button 1',
        doc,
        'button:contains("Button1")'
      ),
      GuiSetup.mTeardownKeyLogger(body, [ ])
    ];
  }, function () {
    success();
  }, failure);
});
