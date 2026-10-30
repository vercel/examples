/-! Pure Lean: no JavaScript. The theorems below are checked when the image is
built, so a deployment with a broken proof never ships. -/

namespace App

def greet (name : String) : String :=
  s!"Hello, {name}, from Lean on Vercel!"

/-- Page size for list endpoints: whatever the client asks for, between 1 and 100. -/
def clampLimit (n : Nat) : Nat :=
  min (max n 1) 100

theorem clampLimit_le_100 (n : Nat) : clampLimit n ≤ 100 := by
  unfold clampLimit; omega

theorem clampLimit_pos (n : Nat) : 1 ≤ clampLimit n := by
  unfold clampLimit; omega

theorem clampLimit_id (n : Nat) (h1 : 1 ≤ n) (h2 : n ≤ 100) : clampLimit n = n := by
  unfold clampLimit; omega

end App
