const { addFilter } = wp.hooks;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const { ToggleControl, PanelBody } = wp.components;
const __ = Drupal.t;

// Inclusion list.
// Exclusion list can be handled the same way.
const includedBlocks = ['core/paragraph', 'core/heading'];

// Attribute definition.
const addHasBackgroundAttribute = settings => {
  if (includedBlocks.includes(settings.name)) {
    settings.attributes = Object.assign(settings.attributes, {
      hasBackground: {
        type: 'boolean',
        default: false,
      },
    });
  }
  return settings;
};

addFilter(
  'blocks.registerBlockType',
  'custom/attributes/has-background',
  addHasBackgroundAttribute,
);

// Attribute controls.
const withHasBackgroundControls = createHigherOrderComponent(
  BlockEdit => props => {
    const { name, attributes, setAttributes, isSelected } = props;
    const { hasBackground } = attributes;
    if (hasBackground === undefined) {
      setAttributes({ hasBackground: false });
    }
    return (
      <div>
        <BlockEdit {...props} />
        {isSelected && includedBlocks.includes(name) && (
          <InspectorControls>
            <PanelBody>
              <ToggleControl
                label={__('Background')}
                checked={!!hasBackground}
                onChange={() =>
                  setAttributes({ hasBackground: !hasBackground })
                }
                help={__('Toggle background.')}
              />
            </PanelBody>
          </InspectorControls>
        )}
      </div>
    );
  },
  'withHasBackgroundControls',
);

addFilter(
  'editor.BlockEdit',
  'custom/controls/has-background',
  withHasBackgroundControls,
);

// Backend editor class.
const withHasBackgroundBlockClass = createHigherOrderComponent(
  BlockListBlock => props => {
    const { attributes } = props;
    const { hasBackground } = attributes;
    props.className = hasBackground
      ? 'attribute__has-background'
      : 'attribute__no-background';
    return <BlockListBlock {...props} />;
  },
  'withHasBackgroundBlockClass',
);

addFilter(
  'editor.BlockListBlock',
  'custom/editor-class/has-background',
  withHasBackgroundBlockClass,
);

// Frontend markup class.
const addUnpublishedClass = (extraProps, blockType, attributes) => {
  if (includedBlocks.includes(blockType.name)) {
    const { hasBackground } = attributes;
    extraProps.className = hasBackground
      ? 'attribute__has-background'
      : 'attribute__no-background';
  }
  return extraProps;
};

addFilter(
  'blocks.getSaveContent.extraProps',
  'custom/class/has-background',
  addUnpublishedClass,
);
