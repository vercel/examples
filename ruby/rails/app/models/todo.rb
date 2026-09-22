class Todo < ApplicationRecord
  normalizes :title, with: ->(title) { title.strip }
  validates :title, presence: true, length: { maximum: 200 }
  validates :list_id, presence: true
  validates :completed, inclusion: { in: [true, false] }
  scope :in_list_order, -> { order(completed: :asc, created_at: :desc, id: :desc) }
end
