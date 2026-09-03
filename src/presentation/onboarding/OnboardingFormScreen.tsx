import { useRef, useState } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { AppIcon } from "@/presentation/components/AppIcon";
import { Button } from "@/presentation/components/Button";
import { QubaText } from "@/presentation/components/QubaText";
import { TextField } from "@/presentation/components/TextField";
import { onboardingFlowCopy } from "@/presentation/onboarding/flowCopy";
import {
  OnboardingAction,
  OnboardingFrame,
} from "@/presentation/onboarding/OnboardingFrame";
import { usePresentation } from "@/presentation/theme/ThemeProvider";
import { roundedFont } from "@/presentation/theme/tokens";

export type OnboardingFormKind =
  "login" | "recovery" | "activation" | "account";
type FieldName =
  "identifier" | "password" | "email" | "nickname" | "username" | "code";
interface FieldSpec {
  readonly name: FieldName;
  readonly label: string;
  readonly placeholder: string;
  readonly autoComplete?: TextInputProps["autoComplete"];
}
interface FormProps {
  readonly kind: OnboardingFormKind;
  readonly onBack: () => void;
  readonly onContinue: () => void;
  readonly onRecovery: () => void;
}

export function OnboardingFormScreen({
  kind,
  onBack,
  onContinue,
  onRecovery,
}: FormProps) {
  const { locale, theme } = usePresentation();
  const copy = onboardingFlowCopy[locale];
  const page = copy[kind];
  const [form, setForm] = useState<{
    values: Partial<Record<FieldName, string>>;
    errors: Partial<Record<FieldName, string>>;
    showPassword: boolean;
    recovered: boolean;
  }>({ values: {}, errors: {}, showPassword: false, recovered: false });
  const refs = useRef<Partial<Record<FieldName, TextInput | null>>>({});
  const email: FieldSpec = {
    name: "email",
    label: copy.email,
    placeholder: copy.emailPlaceholder,
    autoComplete: "email",
  };
  const password: FieldSpec = {
    name: "password",
    label: copy.password,
    placeholder: copy.passwordPlaceholder,
    autoComplete: kind === "account" ? "new-password" : "current-password",
  };
  const fields: readonly FieldSpec[] =
    kind === "login"
      ? [
          {
            name: "identifier",
            label: copy.identifier,
            placeholder: copy.identifierPlaceholder,
            autoComplete: "username",
          },
          password,
        ]
      : kind === "recovery"
        ? [email]
        : kind === "activation"
          ? [{ name: "code", label: copy.codeLabel, placeholder: "QBA-1234" }]
          : [
              {
                name: "nickname",
                label: copy.nickname,
                placeholder: copy.namePlaceholder,
                autoComplete: "nickname",
              },
              {
                name: "username",
                label: copy.username,
                placeholder: copy.usernamePlaceholder,
                autoComplete: "username-new",
              },
              email,
              password,
            ];

  function submit() {
    const errors: Partial<Record<FieldName, string>> = {};
    for (const field of fields) {
      const value = form.values[field.name] ?? "";
      if (!value.trim()) errors[field.name] = copy.required;
      else if (
        field.name === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      )
        errors.email = copy.emailError;
      else if (
        field.name === "password" &&
        kind === "account" &&
        value.length < 8
      )
        errors.password = copy.passwordError;
    }
    const invalid = fields.find((field) => errors[field.name]);
    if (invalid) {
      setForm((current) => ({ ...current, errors }));
      refs.current[invalid.name]?.focus();
      return;
    }
    // UI preview only: no authentication, activation claim, or email side effect.
    // Clear sensitive values before navigating, including screens retained by a stack.
    setForm({
      values: {},
      errors: {},
      showPassword: false,
      recovered: kind === "recovery",
    });
    if (kind !== "recovery") onContinue();
  }

  return (
    <OnboardingFrame
      label={page.label}
      title={page.title}
      description={page.description}
      step={"step" in page ? page.step : undefined}
      onBack={onBack}
    >
      {kind === "activation" ? (
        <View
          style={[
            styles.codeCard,
            {
              backgroundColor: theme.colors.surfaceAccent,
              borderRadius: theme.radii.lg,
            },
          ]}
        >
          <AppIcon name="star-four-points-outline" size={44} />
          <QubaText color="muted" variant="caption">
            {copy.codeExample}
          </QubaText>
        </View>
      ) : null}
      <QubaText color="muted" variant="caption">
        {copy.requiredNote}
      </QubaText>
      <View style={styles.fields}>
        {fields.map((field, index) => (
          <View key={field.name}>
            <TextField
              ref={(input) => {
                refs.current[field.name] = input;
              }}
              label={field.label}
              placeholder={field.placeholder}
              error={form.errors[field.name]}
              value={form.values[field.name] ?? ""}
              onChangeText={(value) =>
                setForm((current) => ({
                  ...current,
                  recovered: false,
                  values: { ...current.values, [field.name]: value },
                  errors: { ...current.errors, [field.name]: undefined },
                }))
              }
              autoComplete={field.autoComplete}
              autoCorrect={false}
              autoCapitalize={
                field.name === "nickname"
                  ? "words"
                  : field.name === "code"
                    ? "characters"
                    : "none"
              }
              keyboardType={
                field.name === "email" ? "email-address" : "default"
              }
              secureTextEntry={field.name === "password" && !form.showPassword}
              returnKeyType={index === fields.length - 1 ? "done" : "next"}
              submitBehavior="submit"
              onSubmitEditing={() => {
                const next = fields[index + 1];
                if (next) refs.current[next.name]?.focus();
                else submit();
              }}
              style={field.name === "code" ? styles.codeInput : undefined}
            />
            {field.name === "password" ? (
              <Button
                label={
                  form.showPassword ? copy.hidePassword : copy.showPassword
                }
                icon={form.showPassword ? "eye-off-outline" : "eye-outline"}
                variant="secondary"
                style={styles.textButton}
                onPress={() =>
                  setForm((current) => ({
                    ...current,
                    showPassword: !current.showPassword,
                  }))
                }
              />
            ) : null}
          </View>
        ))}
      </View>
      {kind === "login" ? (
        <Button
          label={copy.recovery.label}
          variant="secondary"
          style={styles.textButton}
          onPress={() => {
            setForm({
              values: {},
              errors: {},
              showPassword: false,
              recovered: false,
            });
            onRecovery();
          }}
        />
      ) : null}
      {kind === "activation" ? (
        <QubaText color="muted" variant="caption">
          {copy.codeHint}
        </QubaText>
      ) : null}
      {kind === "account" ? (
        <View
          style={[
            styles.notice,
            {
              backgroundColor: theme.colors.surfaceAccent,
              borderRadius: theme.radii.md,
            },
          ]}
        >
          <QubaText variant="label">{copy.localTitle}</QubaText>
          <QubaText color="muted" variant="caption">
            {copy.localDescription}
          </QubaText>
        </View>
      ) : null}
      <QubaText
        accessibilityLiveRegion="polite"
        role="status"
        style={!form.recovered && styles.emptyStatus}
      >
        {form.recovered ? copy.recoveryResult : ""}
      </QubaText>
      <OnboardingAction label={page.action} onPress={submit} />
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  fields: { gap: 12 },
  codeCard: { padding: 24, alignItems: "center", gap: 10 },
  codeInput: {
    fontFamily: roundedFont(800),
    textAlign: "center",
    letterSpacing: 3,
  },
  textButton: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    paddingHorizontal: 4,
    minHeight: 44,
  },
  notice: { padding: 16, gap: 6 },
  emptyStatus: { height: 0 },
});
