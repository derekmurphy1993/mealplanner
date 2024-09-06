import React, { useState } from "react";

export default function CreateMeal() {
	const [showAddRecipe, setShowAddRecipe] = useState(true);

	const checkHandler = () => {
		setShowAddRecipe(!showAddRecipe);
	};
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
					<div className="flex">
						<p className="mr-3"> Add Recipe Info </p>
						<input
							type="checkbox"
							id="recipeCheckbox"
							checked={showAddRecipe}
							onChange={checkHandler}
						/>{" "}
					</div>
				</div>
				{showAddRecipe && (
					<div className="flex flex-col">
						Recipe Url:
						<input
							type="text"
							placeholder="URL"
							className="border p-3 rounded-lg"
							id="recipeUrl"
							maxLength="320"
							minLength="6"
						/>
						<div className="font-semibold text-green-700 hover:text-green-500">
							Add Ingredient
						</div>
						Ingredient:
						<div className="flex">
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
								placeholder="unit"
								className="border p-3 rounded-lg"
								id="unit"
							/>
							<div className="font-semibold text-red-700 hover:text-red-500">
								Remove Ingredient
							</div>
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
