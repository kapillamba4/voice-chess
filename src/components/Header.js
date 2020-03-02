import React, { Component } from "react";
import "./Header.scss";
import { ReactComponent as GithubIcon } from "../icon-github.svg";
import { connect } from "react-redux";

class Header extends Component {
  render() {
    return (
      <div className="page-header">
        <div className="header-name">Voice Chess</div>
        <div className="current-player">
          Current Player:{" "}
          {this.props.fen.split(" ")[1] === "w" ? "White" : "Black"}
        </div>
        <a href="https://github.com/kapillamba4/voice-chess">
          <GithubIcon className="github-icon" />
        </a>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state.commands });

export default connect(mapStateToProps, null)(Header);
