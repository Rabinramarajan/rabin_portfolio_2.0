"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CircleAlert,
  DollarSign,
  LoaderCircle,
  Mail,
  Paperclip,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MuiProvider } from "@/components/MuiProvider";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { profile } from "@/content/profile";
import { services } from "@/content/services";
import { budgetRanges, timelines } from "@/content/pricing";
import { duration, ease } from "@/lib/motion";

type SubmitState = "idle" | "loading" | "ok" | "err";

const projectTypes = [...services.map((s) => s.title), "Other"];

function ContactFormFields({ defaultProjectType }: { defaultProjectType?: string }) {
  const reduce = useReducedMotion();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: defaultProjectType && projectTypes.includes(defaultProjectType) ? defaultProjectType : "",
      budget: "",
      timeline: "",
      message: "",
      website: "",
    },
  });

  const fieldReveal = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: reduce ? duration.micro : duration.interaction, delay: reduce ? 0 : Math.min(0.04 * i, 0.28), ease },
  });

  async function onSubmit(values: ContactInput) {
    setSubmitState("loading");
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSubmitState("ok");
        toast.success("Message received");
        return;
      }

      const body = (await res.json().catch(() => null)) as { error?: string; fieldErrors?: Record<string, string[]> } | null;
      if (body?.fieldErrors) {
        const firstKey = Object.keys(body.fieldErrors)[0];
        for (const [key, msgs] of Object.entries(body.fieldErrors)) {
          setError(key as keyof ContactInput, { type: "server", message: msgs[0] });
        }
        setServerMessage(body.error ?? "Please fix the highlighted fields.");
        setSubmitState("err");
        toast.error("Please fix the highlighted fields.");
        if (firstKey) {
          const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
          el?.focus();
        }
        return;
      }
      setServerMessage(body?.error ?? "Could not send. Try email instead.");
      setSubmitState("err");
      toast.error(body?.error ?? "Could not send.");
    } catch {
      setSubmitState("err");
      setServerMessage("Something went wrong while sending your message. Please try again or email me directly.");
      toast.error("Something went wrong. Please try again.");
    }
  }

  const emailHref = useMemo(() => `mailto:${profile.email}`, []);

  /* ---- Success state ---- */
  if (submitState === "ok") {
    return (
      <motion.div
        className="form-success"
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.interaction, ease }}
      >
        <motion.div
          className="form-success__icon"
          initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: duration.section, ease, delay: 0.05 }}
        >
          <Check aria-hidden />
        </motion.div>
        <motion.span
          className="form-success__line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: duration.section, ease, delay: 0.25 }}
        />
        <Typography variant="h5" component="h3" className="form-success__title" sx={{ fontWeight: 700, letterSpacing: "0.02em" }}>
          MESSAGE RECEIVED.
        </Typography>
        <Typography className="form-success__text" color="text.secondary">
          Thanks for reaching out. Your project details are safely on their way — I will review them and get back to you.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} className="form-success__actions" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              reset();
              setSubmitState("idle");
            }}
          >
            Send another message
          </Button>
          <Button component={Link} href="/work" variant="contained" color="primary" endIcon={<ArrowRight size={18} aria-hidden />}>
            Back to portfolio
          </Button>
        </Stack>
      </motion.div>
    );
  }

  return (
    <Box component="form" className="contact-form-root" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <Box className="hp" aria-hidden sx={{ position: "absolute", left: "-9999px" }}>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </Box>

      <Stack spacing={2.5}>
        <Box className="form-row form-row--2">
          <motion.div {...fieldReveal(0)}>
            <TextField
              id="name"
              label="Full name"
              placeholder="Your full name"
              autoComplete="name"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={17} className="form-field__icon" aria-hidden />
                    </InputAdornment>
                  ),
                },
              }}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </motion.div>

          <motion.div {...fieldReveal(1)}>
            <TextField
              id="email"
              type="email"
              label="Email address"
              placeholder="your.email@example.com"
              autoComplete="email"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={17} className="form-field__icon" aria-hidden />
                    </InputAdornment>
                  ),
                },
              }}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </motion.div>
        </Box>

        <motion.div {...fieldReveal(2)}>
          <TextField
            id="company"
            label="Company / Organization (Optional)"
            placeholder="Your company or organization"
            autoComplete="organization"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Building2 size={17} className="form-field__icon" aria-hidden />
                  </InputAdornment>
                ),
              },
            }}
            {...register("company")}
            error={!!errors.company}
            helperText={errors.company?.message}
          />
        </motion.div>

        <Box className="form-row form-row--2">
          <motion.div {...fieldReveal(3)}>
            <Controller
              name="projectType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="projectType"
                  select
                  label="Project type"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Sparkles size={17} className="form-field__icon" aria-hidden />
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.projectType}
                  helperText={errors.projectType?.message}
                >
                  <MenuItem value="">Select project type</MenuItem>
                  {projectTypes.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </motion.div>

          <motion.div {...fieldReveal(4)}>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="budget"
                  select
                  label="Budget range"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <DollarSign size={17} className="form-field__icon" aria-hidden />
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.budget}
                  helperText={errors.budget?.message}
                >
                  <MenuItem value="">Select budget range</MenuItem>
                  {budgetRanges.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </motion.div>
        </Box>

        <motion.div {...fieldReveal(5)}>
          <Controller
            name="timeline"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="timeline"
                select
                label="Timeline"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={17} className="form-field__icon" aria-hidden />
                      </InputAdornment>
                    ),
                  },
                }}
                error={!!errors.timeline}
                helperText={errors.timeline?.message}
              >
                <MenuItem value="">Select timeline</MenuItem>
                {timelines.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </motion.div>

        <motion.div {...fieldReveal(6)}>
          <TextField
            id="message"
            label="Your message"
            placeholder="Tell me about your project, goals and requirements..."
            multiline
            minRows={6}
            fullWidth
            {...register("message")}
            error={!!errors.message}
            helperText={errors.message?.message}
          />
        </motion.div>

        <motion.div {...fieldReveal(7)}>
          <Box className="form-attach">
            <Paperclip size={18} aria-hidden />
            <span>
              <strong>Attach brief (Optional)</strong>
              <span>PDF, DOC, or any file</span>
            </span>
          </Box>
        </motion.div>

        <motion.div {...fieldReveal(8)}>
          <Stack spacing={1.5}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={submitState === "loading" || isSubmitting || isValidating}
              endIcon={
                submitState === "loading" || isSubmitting ? (
                  <LoaderCircle className="form__spin" size={18} aria-hidden />
                ) : (
                  <ArrowRight size={18} aria-hidden />
                )
              }
            >
              {submitState === "loading" || isSubmitting ? "Sending..." : "Start a Conversation"}
            </Button>

            {submitState === "err" ? (
              <Alert severity="error" icon={<CircleAlert size={18} aria-hidden />}>
                {serverMessage || "Something went wrong while sending your message. Please try again or email me directly."}{" "}
                <a href={emailHref}>Email me instead</a>
              </Alert>
            ) : (
              <Typography variant="body2" color="text.secondary" className="form-privacy">
                <ShieldCheck size={15} aria-hidden /> Your information is safe with me. I&apos;ll never share your
                details with anyone.
              </Typography>
            )}
          </Stack>
        </motion.div>
      </Stack>
    </Box>
  );
}

export function ContactForm({ defaultProjectType }: { defaultProjectType?: string }) {
  return (
    <MuiProvider>
      <ContactFormFields defaultProjectType={defaultProjectType} />
    </MuiProvider>
  );
}
