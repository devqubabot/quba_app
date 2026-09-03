import { useId, type Ref } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { QubaText } from "@/presentation/components/QubaText";
import { usePresentation } from "@/presentation/theme/ThemeProvider";

interface TextFieldProps extends TextInputProps {
  readonly error?: string;
  readonly label: string;
  readonly ref?: Ref<TextInput>;
}

export function TextField({ error, label, style, ...props }: TextFieldProps) {
  const { theme } = usePresentation();
  const errorId = useId();
  return (
    <View style={styles.group}>
      <QubaText variant="label">{label}</QubaText>
      <TextInput
        accessibilityHint={error}
        accessibilityLabel={label}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          theme.typography.body,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.radii.md,
            color: theme.colors.text,
            minHeight: theme.touchTargets.comfortable,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <QubaText
          nativeID={errorId}
          accessibilityLiveRegion="polite"
          color="danger"
          variant="caption"
        >
          {error}
        </QubaText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  input: { borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 12 },
});
