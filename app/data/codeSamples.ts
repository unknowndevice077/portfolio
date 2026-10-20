// Real excerpts from the repos (trimmed where marked with "..."), not code written for the portfolio.

export type CodeSample = {
  id: string;
  title: string;
  project: string;
  projectSlug: string;
  language: "python" | "typescript" | "java" | "sql" | "cpp";
  languageLabel: string;
  path: string;
  url: string;
  why: string;
  code: string;
};

const gh = (repo: string, branch: string, path: string) =>
  `https://github.com/unknowndevice077/${repo}/blob/${branch}/${path}`;

export const codeSamples: CodeSample[] = [
  {
    id: "alert-episodes",
    title: "One incident per real event",
    project: "EcoVision",
    projectSlug: "ecovision",
    language: "python",
    languageLabel: "Python",
    path: "maincode/detection_rules.py",
    url: gh("ecovision-crime-detection-ai", "master", "maincode/detection_rules.py"),
    why: "A camera hovering right at the threshold kept re-firing every cooldown and created 239 incidents for one event. Tracking the episode itself fixed it: confirm, hold, release with hysteresis, and only alert once per episode.",
    code: `def update(self, is_assault: bool, is_armed: bool, frame_no: int, override_assault_confirm: int = None) -> str:
    confirm_needed = override_assault_confirm if override_assault_confirm is not None else ASSAULT_CONFIRM_FRAMES
    self.evidence_buf.append(int(is_assault))

    if is_assault:
        self.assault_confirm  = min(self.assault_confirm + 1, confirm_needed)
        self.assault_release  = 0
    else:
        self.assault_release = min(self.assault_release + 1, ASSAULT_RELEASE_FRAMES)
        if self.assault_release >= ASSAULT_RELEASE_FRAMES:
            self.assault_confirm = 0
    ...
    if self.state == "NEUTRAL" and self.active_incident_id is not None:
        # Genuine release -- this episode is over. The NEXT confirm (if
        # any) starts a fresh incident, not a continuation of this one.
        self.active_incident_id = None
        self.episode_end_frame  = frame_no
    return self.state

def should_alert(self, frame_no: int, scene_last: int, scene_cooldown: int = None) -> bool:
    if scene_cooldown is None:
        scene_cooldown = SCENE_COOLDOWN_ASSAULT
    if self.state != "ASSAULT" and self.state != "ARMED":
        return False
    if self.active_incident_id is not None:
        # Same ongoing episode as an already-posted alert
        return False
    evidence_ok = True if self.state == "ARMED" else (sum(self.evidence_buf) >= EVIDENCE_THRESHOLD)
    debounce_ok = (frame_no - self.episode_end_frame) > ALERT_COOLDOWN_FRAMES
    scene_ok    = (frame_no - scene_last) > scene_cooldown
    return evidence_ok and debounce_ok and scene_ok`,
  },
  {
    id: "no-double-booking",
    title: "Double booking enforced by the database",
    project: "QueueUp",
    projectSlug: "queueup",
    language: "sql",
    languageLabel: "SQL",
    path: "backend/src/main/resources/db/migration/V3__bookings.sql",
    url: gh("queueup", "main", "backend/src/main/resources/db/migration/V3__bookings.sql"),
    why: "Checking for overlaps in Java has a race: two requests can both see a free slot. A PostgreSQL exclusion constraint makes overlapping active bookings for the same staff member impossible, even under concurrency.",
    code: `    CONSTRAINT booking_status_valid
        CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW')),
    CONSTRAINT booking_amounts_non_negative CHECK (price_centavos >= 0 AND deposit_centavos >= 0),
    CONSTRAINT booking_no_staff_overlap EXCLUDE USING gist (
        staff_membership_id WITH =,
        tstzrange(starts_at, ends_at) WITH &&
    ) WHERE (status IN ('PENDING_PAYMENT', 'CONFIRMED'))
);
CREATE INDEX booking_tenant_starts_idx ON booking (tenant_id, starts_at);
CREATE INDEX booking_staff_starts_idx ON booking (staff_membership_id, starts_at);
CREATE INDEX booking_pending_created_idx ON booking (created_at) WHERE status = 'PENDING_PAYMENT';`,
  },
  {
    id: "refresh-rotation",
    title: "Refresh-token rotation with theft detection",
    project: "QueueUp",
    projectSlug: "queueup",
    language: "java",
    languageLabel: "Java",
    path: "backend/src/main/java/com/queueup/auth/RefreshTokenService.java",
    url: gh("queueup", "main", "backend/src/main/java/com/queueup/auth/RefreshTokenService.java"),
    why: "Every refresh issues a new token in the same family and revokes the old one. If a revoked token is ever presented again, someone copied it, so the whole family is revoked and the user has to sign in again.",
    code: `@Transactional(noRollbackFor = UnauthorizedException.class)
public Rotation rotate(String rawToken) {
  RefreshToken current = repository.findForUpdateByTokenHash(hash(rawToken))
      .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
  Instant now = clock.instant();
  if (current.isRevoked()) {
    int revoked = repository.revokeFamily(current.getFamilyId(), now);
    log.warn("Refresh token reuse detected for user {}; revoked {} tokens in family", current.getUserId(), revoked);
    throw new UnauthorizedException("Refresh token reuse detected; please sign in again");
  }
  if (current.isExpired(now)) {
    throw new UnauthorizedException("Refresh token expired");
  }
  NewToken successor = createToken(current.getUserId(), current.getFamilyId());
  current.setRevokedAt(now);
  current.setReplacedBy(successor.entity().getId());
  return new Rotation(current.getUserId(), successor.rawToken());
}`,
  },
  {
    id: "sensor-fusion",
    title: "Two sensors, failing safe",
    project: "Bantay Baha",
    projectSlug: "bantay-baha",
    language: "typescript",
    languageLabel: "TypeScript",
    path: "src/fusion/fusion.ts",
    url: gh("bantay-baha", "main", "src/fusion/fusion.ts"),
    why: "The ultrasonic and the gauge camera are fused by inverse variance. A frozen or erratic sensor is recognised and dropped, and an unexplained disagreement uses the higher reading, so a faulty sensor can make a flood warning early but never late.",
    code: `update(t: number, u: number, cam: Pick<CameraReading, 'level' | 'low'>): FusionResult {
  const c = cam.level;
  this.window.push({ t, u });
  while (this.window.length && this.window[0].t < t - WINDOW_S) this.window.shift();
  const us = this.window.map((s) => s.u);

  // A working sensor always jitters by a few millimetres,
  // so the same value FROZEN_N times running means it is stuck.
  const last = us.slice(-FROZEN_N);
  const frozen = last.length === FROZEN_N && Math.max(...last) - Math.min(...last) < 1e-4;
  const jumps = us.slice(1).filter((v, i) => Math.abs(v - us[i]) > 0.25).length;
  const erratic = jumps >= 2;
  const camOk = c !== null && !cam.low;

  const apart = c === null ? 0 : cam.low ? Math.max(0, u - c) : Math.abs(u - c);
  if (apart > DISAGREE_M) this.disagreeSince ??= t;
  else this.disagreeSince = null;
  const disagree = this.disagreeSince !== null && t - this.disagreeSince >= DISAGREE_S;

  if (frozen) return camOk ? this.result(c, 'camera', 'Ultrasonic reading frozen', u, c) : this.result(u, 'ultrasonic', 'Ultrasonic reading frozen and camera cannot help', u, c);
  if (erratic && camOk) return this.result(c, 'camera', 'Ultrasonic giving erratic echoes', u, c);
  if (disagree) {
    // No recognisable cause: fail safe and use the higher reading.
    const useCam = c! > u;
    return this.result(useCam ? c! : u, useCam ? 'camera' : 'ultrasonic', \`Sensors disagree by \${Math.round(apart * 100)} cm\`, u, c);
  }
  ...
  const level = (u / VAR_US + c / VAR_CAM) / (1 / VAR_US + 1 / VAR_CAM);
  return this.result(level, 'fused', null, u, c);
}`,
  },
  {
    id: "oled-flush",
    title: "One I2C transaction per display page",
    project: "jaemboy",
    projectSlug: "jaemboy",
    language: "cpp",
    languageLabel: "C++",
    path: "src/oled.cpp",
    url: gh("jaemboy", "claude/hopeful-wright-mbjui9", "src/oled.cpp"),
    why: "U8g2's own flush was too chatty for two screens behind a multiplexer. This sets the page and column with control bytes and streams the whole 128-byte page in a single transaction, and recovers a panel that gets stuck mid-transfer.",
    code: `bool Oled::writePages() {
  if (!I2CBus::select(channel_)) return false;
  const uint8_t* buf = u8g2_.getBufferPtr();
  constexpr uint8_t col = OLED_COL_OFFSET;
  bool ok = true;

  for (uint8_t page = 0; page < OLED_HEIGHT / 8; page++) {
    Wire.beginTransmission(OLED_I2C_ADDR);
    // 0x80 = "one command byte follows, more control bytes after it".
    // Lets us set the page/column and stream data in a single transaction.
    Wire.write(0x80); Wire.write(0xB0 | page);
    Wire.write(0x80); Wire.write(0x00 | (col & 0x0F));
    Wire.write(0x80); Wire.write(0x10 | (col >> 4));
    Wire.write(0x40);  // the rest is display data
    Wire.write(buf + page * OLED_WIDTH, OLED_WIDTH);
    uint8_t err = Wire.endTransmission();
    if (err) {
      Serial.printf("[oled ch%u] page %u write failed: %s\\n", channel_, page,
                    I2CBus::errStr(err));
      ok = false;
    }
  }
  return ok;
}`,
  },
  {
    id: "socket-attach",
    title: "The production crash that only polling could trigger",
    project: "Clash Games",
    projectSlug: "clash-games",
    language: "typescript",
    languageLabel: "TypeScript",
    path: "server/src/index.ts",
    url: gh("copycatclash", "main", "server/src/index.ts"),
    why: "Players on networks that block WebSockets crashed the live server. Express was attached after Socket.IO, so both answered the same long-polling request. Making Express the server's handler from the start, and delegating lazily, fixed it.",
    code: `// Express must be the server's request handler *before* Socket.IO attaches: Socket.IO only keeps
// /socket.io/ requests away from the handlers that exist at attach time. Adding Express afterwards
// let it answer HTTP long-polling requests too (with index.html), so Socket.IO's own reply then
// threw ERR_HTTP_HEADERS_SENT and crashed the process. The app needs \`io\`, so delegate lazily.
let app: ReturnType<typeof createApp> | null = null;
const httpServer = createServer((req, res) => {
  if (app) app(req, res);
  else res.writeHead(503).end();
});
const io = createIo(httpServer);
...
const ctx = createContext(io, store);
await ctx.photos.init();

app = createApp(ctx);
attachSocketLayer(io, ctx);
ctx.matchmaker.start();`,
  },
];
