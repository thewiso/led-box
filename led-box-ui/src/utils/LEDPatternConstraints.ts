export let NameMinLength = 3;
export let NameMaxLength = 20;

export let ColorCountMin = 1;
export let ColorCountMax = 5;

export let RepititionFactorMin = 0;
export let RepititionFactorMax = 1;

export let ColorGradientLengthFactorMin = 0;
export let ColorGradientLengthFactorMax = 0.5;

export let BlinkSpeedMin = 0.1;
export let BlinkSpeedMax = 3;

export let BlinkDimmingPeriodFactorMin = 0;
export let BlinkDimmingPeriodFactorMax = 1;

export let ChaseSpeedMin = 1;
export let ChaseSpeedMax = 150;

export let ChaseLengthFactorMin = 0;
export let ChaseLengthFactorMax = 0.99;

export let ChaseGradientLengthFactorMin = 0;
export let ChaseGradientLengthFactorMax = 0.5;

const MIN_ITEMS_PROPERTY = "minItems";
const MAX_ITEMS_PROPERTY = "maxItems";

const MINIMUM_PROPERTY = "minimum";
const MAXIMUM_PROPERTY = "maximum";

const MIN_LENGTH_PROPERTY = "minLength";
const MAX_LENGTH_PROPERTY = "maxLength";

function GetConstraintFromLedPatternProperties<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemas: any,
  modelName: string,
  propertyName: string,
  constraintName: string,
  defaultValue: T,
) {
  const constraint = schemas?.[modelName]?.["properties"]?.[propertyName]?.[constraintName];
  if (constraint !== undefined) {
    return constraint;
  } else {
    return defaultValue;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReadConstraintsFromOpenApiYaml(yamlDoc: any | null | undefined) {
  const schemas = yamlDoc?.["components"]?.["schemas"];

  if (schemas !== undefined) {
    NameMinLength = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "name",
      MIN_LENGTH_PROPERTY,
      NameMinLength,
    );
    NameMaxLength = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "name",
      MAX_LENGTH_PROPERTY,
      NameMinLength,
    );

    ColorCountMin = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "colors",
      MIN_ITEMS_PROPERTY,
      ColorCountMin,
    );
    ColorCountMax = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "colors",
      MAX_ITEMS_PROPERTY,
      ColorCountMax,
    );

    RepititionFactorMin = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "repitionFactor",
      MINIMUM_PROPERTY,
      RepititionFactorMin,
    );
    RepititionFactorMax = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "repitionFactor",
      MAXIMUM_PROPERTY,
      RepititionFactorMax,
    );

    ColorGradientLengthFactorMin = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "colorGradientLengthFactor",
      MINIMUM_PROPERTY,
      ColorGradientLengthFactorMin,
    );
    ColorGradientLengthFactorMax = GetConstraintFromLedPatternProperties(
      schemas,
      "LEDPattern",
      "colorGradientLengthFactor",
      MAXIMUM_PROPERTY,
      ColorGradientLengthFactorMax,
    );

    BlinkSpeedMin = GetConstraintFromLedPatternProperties(
      schemas,
      "BlinkLEDPattern",
      "blinkSpeed",
      MINIMUM_PROPERTY,
      BlinkSpeedMin,
    );
    BlinkSpeedMax = GetConstraintFromLedPatternProperties(
      schemas,
      "BlinkLEDPattern",
      "blinkSpeed",
      MAXIMUM_PROPERTY,
      BlinkSpeedMax,
    );

    BlinkDimmingPeriodFactorMin = GetConstraintFromLedPatternProperties(
      schemas,
      "BlinkLEDPattern",
      "blinkDimmingPeriodFactor",
      MINIMUM_PROPERTY,
      BlinkDimmingPeriodFactorMin,
    );
    BlinkDimmingPeriodFactorMax = GetConstraintFromLedPatternProperties(
      schemas,
      "BlinkLEDPattern",
      "blinkDimmingPeriodFactor",
      MAXIMUM_PROPERTY,
      BlinkDimmingPeriodFactorMax,
    );

    ChaseSpeedMin = GetConstraintFromLedPatternProperties(
      schemas,
      "ChaseLEDPattern",
      "chaseSpeed",
      MINIMUM_PROPERTY,
      ChaseSpeedMin,
    );
    ChaseSpeedMax = GetConstraintFromLedPatternProperties(
      schemas,
      "ChaseLEDPattern",
      "chaseSpeed",
      MAXIMUM_PROPERTY,
      ChaseSpeedMax,
    );

    ChaseLengthFactorMin = GetConstraintFromLedPatternProperties(
      schemas,
      "ChaseLEDPattern",
      "chaseLengthFactor",
      MINIMUM_PROPERTY,
      ChaseLengthFactorMin,
    );
    ChaseLengthFactorMax = GetConstraintFromLedPatternProperties(
      schemas,
      "ChaseLEDPattern",
      "chaseLengthFactor",
      MAXIMUM_PROPERTY,
      ChaseLengthFactorMax,
    );

    ChaseGradientLengthFactorMin = GetConstraintFromLedPatternProperties(
      schemas,
      "ChaseLEDPattern",
      "chaseGradientLengthFactor",
      MINIMUM_PROPERTY,
      ChaseGradientLengthFactorMin,
    );
    ChaseGradientLengthFactorMax = GetConstraintFromLedPatternProperties(
      schemas,
      "ChaseLEDPattern",
      "chaseGradientLengthFactor",
      MAXIMUM_PROPERTY,
      ChaseGradientLengthFactorMax,
    );
  } else {
    throw new Error("Could not parse yaml because document.components.schemas is undefined: " + yamlDoc);
  }
}
