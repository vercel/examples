Rails.application.config.session_store :cookie_store,
  key: "_vercel_todo_session",
  expire_after: 1.year,
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true
