import React, { useState } from "react";

export default function CreateMeal() {
	const [ShowAddRecipe, setShowAddRecipe] = useState(true);
	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">CreateMeal</h1>
			<form className="flex flex-col sm:flex-row">
				<div className="flex flex-col gap-4">
					<input
						type="text"
						placeholder="Meal Name*"
						className="border p-3 rounded-lg"
						id="name"
						maxLength="120"
						minLength="6"
						required
					/>
					<input
						type="number"
						placeholder="Calories p/ serving*"
						className="border p-3 rounded-lg"
						id="calories"
						required
					/>
					<input
						type="number"
						placeholder="Carbs p/ serving"
						className="border p-3 rounded-lg"
						id="carbs"
					/>
					<input
						type="number"
						placeholder="Fats p/ serving"
						className="border p-3 rounded-lg"
						id="fats"
					/>
					<input
						type="number"
						placeholder="Protien p/ serving"
						className="border p-3 rounded-lg"
						id="prots"
					/>
					<input type="checkbox" /> <p> Add Recipe Info </p>
				</div>
				{ShowAddRecipe && (
					<div className="">
						Recipe Url:
						<input
							type="text"
							placeholder="URL"
							className="border p-3 rounded-lg"
							id="recipeUrl"
							maxLength="320"
							minLength="6"
						/>
						Ingredient:
						<div>
							<input
								type="text"
								placeholder="Ingredient"
								className="border p-3 rounded-lg"
								id="name"
								maxLength="120"
								minLength="6"
							/>
							<input
								type="number"
								placeholder="amount"
								className="border p-3 rounded-lg"
								id="amount"
							/>
							<input
								type="text"
								placeholder="amount"
								className="border p-3 rounded-lg"
								id="amount"
							/>
						</div>
						Step:
						<input
							type="text"
							placeholder="Include the step for the recipe here in order"
							className="border p-3 rounded-lg"
							id="name"
							maxLength="520"
							minLength="6"
							required
						/>
					</div>
				)}
			</form>
		</main>
	);
}
