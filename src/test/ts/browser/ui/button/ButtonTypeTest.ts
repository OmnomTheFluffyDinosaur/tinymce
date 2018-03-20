import { Assertions, Logger, Step } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { Attr } from '@ephox/sugar';
import * as GuiFactory from 'ephox/alloy/api/component/GuiFactory';
import * as Memento from 'ephox/alloy/api/component/Memento';
import { Button } from 'ephox/alloy/api/ui/Button';
import GuiSetup from 'ephox/alloy/test/GuiSetup';

UnitTest.asynctest('Browser Test: .ui.button.ButtonTypeTest', function () {
  const success = arguments[arguments.length - 2];
  const failure = arguments[arguments.length - 1];

  // This button specifies the type, so it should not change to "button"
  const memSubmitButton = Memento.record(
    Button.sketch({
      dom: {
        tag: 'button',
        attributes: {
          type: 'submit'
        }
      }
    })
  );

  const memButton = Memento.record(
    Button.sketch({
      dom: {
        tag: 'button'
      }
    })
  );

  const memSpan = Memento.record(
    Button.sketch({
      dom: {
        tag: 'span'
      }
    })
  );

  const memTypedSpan = Memento.record(
    Button.sketch({
      dom: {
        tag: 'span',
        attributes: {
          type: 'submit'
        }
      }
    })
  );

  /*
   * The purpose of this test is to check that the type attribute is only defaulted
   * when the type is button (and that any specified type does not clobber it)
   */
  GuiSetup.setup(function (store, doc, body) {

    return GuiFactory.build({
      dom: {
        tag: 'div'
      },
      components: [
        memSubmitButton.asSpec(),
        memButton.asSpec(),
        memSpan.asSpec(),
        memTypedSpan.asSpec()
      ]
    });
  }, function (doc, body, gui, component, store) {
    const sCheck = function (label, expected, memento) {
      return Logger.t(
        label,
        Step.sync(function () {
          const button = memento.get(component);
          Assertions.assertEq('"type" attribute', expected, Attr.get(button.element(), 'type'));
        })
      );
    };

    return [
      sCheck('Submit button', 'submit', memSubmitButton),
      sCheck('Button', 'button', memButton),
      sCheck('Span', undefined, memSpan),
      sCheck('Typed Span', 'submit', memTypedSpan)
    ];
  }, success, failure);
});
